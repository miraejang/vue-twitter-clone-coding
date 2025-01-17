<template>
  <div class="flex flex-1 h-screen" v-if="profileUser">
    <!-- profile section -->
    <div class="felx flex-1 flex-col border-r border-default">
      <!-- title -->
      <div class="flex px-3 py-1 border-b border-default">
        <button class="mr-2" @click="router.go(-1)">
          <i class="fas fa-arrow-left text-primary p-3 rounded-full hover: bg-blue-50"></i>
        </button>
        <div>
          <div class="font-extrabold text-lg">{{ profileUser.email }}</div>
          <div class="text-xs text-light">{{ profileUser.num_tweets }} Tweets</div>
        </div>
      </div>
      <!-- profile image -->
      <div class="h-48 bg-gray-300 relative flex-none">
        <img :src="profileUser.background_image_url" alt="" class="w-full h-48 object-cover" />
        <div class="absolute -bottom-14 left-2- w-32 h-32 rounded-full border-4 border-white bg-gray-100">
          <img :src="profileUser.profile_image_url" class="w-full h-full rounded-full opacity-90 hover:opacity-100 cursor-pointer object-cover" alt="" />
        </div>
      </div>
      <!-- profile edit button -->
      <div class="text-right mt-2 mr-2 h-10">
        <div v-if="currentUser.uid === profileUser.uid">
          <button @click="showProfileEditModal = true" class="border-2 text-primary border-primary px-3 py-1 hover:bg-blue-50 font-bold rounded-full">Edit profile</button>
        </div>
        <div v-else>
          <div @click="onUnfollow" v-if="currentUser.followings.includes(profileUser.uid)" class="relative">
            <button class="text-sm bg-primary text-white px-3 py-2 font-bold rounded-full">Following</button>
            <button class="text-sm bg-pink-700 text-white px-3 py-2 font-bold rounded-full">Unfollowing</button>
          </div>
          <div @click="onFollow" v-else>
            <button class="border-2 text-primary border-primary px-3 py-1 hover:bg-blue-50 font-bold rounded-full">Follow</button>
          </div>
        </div>
      </div>
      <!-- user info -->
      <div class="mx-3 mt-2">
        <div class="font-extrabold text-lg">{{ profileUser.email }}</div>
        <div class="text-light">{{ profileUser.username }}</div>
        <div>
          <span class="text-light">Joined </span>
          <span class="text-light">{{ moment(profileUser.created_at).format('LL') }}</span>
        </div>
        <div>
          <span class="font-bold mr-1">{{ profileUser.followings.length }}</span>
          <span class="text-light mr-3">Follwing</span>
          <span class="font-bold mr-1">{{ profileUser.followers.length }}</span>
          <span class="text-light">Follwers</span>
        </div>
      </div>
      <!-- tabs -->
      <div class="flex justify-between border-b border-default mt-3">
        <div
          @click="currentTab = 'tweets'"
          :class="currentTab === 'tweets' ? 'border-b border-primary text-primary' : 'text-light'"
          class="w-1/4 py-3 font-bold text-center hover:bg-blue-50 hover:text-primary cursor-pointer"
        >
          Tweets
        </div>
        <div
          @click="currentTab = 'replies'"
          :class="currentTab === 'replies' ? 'border-b border-primary text-primary' : 'text-light'"
          class="w-1/4 py-3 font-bold text-center hover:bg-blue-50 hover:text-primary cursor-pointer"
        >
          Tweets & repiles
        </div>
        <div
          @click="currentTab = 'media'"
          :class="currentTab === 'media' ? 'border-b border-primary text-primary' : 'text-light'"
          class="w-1/4 py-3 font-bold text-center hover:bg-blue-50 hover:text-primary cursor-pointer"
        >
          Media
        </div>
        <div
          @click="currentTab = 'likes'"
          :class="currentTab === 'likes' ? 'border-b border-primary text-primary' : 'text-light'"
          class="w-1/4 py-3 font-bold text-center hover:bg-blue-50 hover:text-primary cursor-pointer"
        >
          Likes
        </div>
      </div>
      <!-- tweets -->
      <div class="overflow-y-scroll">
        <tweet-form v-for="tweet in currentTab === 'tweets' ? tweets : currentTab === 'replies' ? replies : likes" :key="tweet.id" :currentUser="currentUser" :tweet="tweet"></tweet-form>
      </div>
    </div>
    <!-- trend section -->
    <trend-section></trend-section>
    <profile-edit-modal v-if="showProfileEditModal" @close-modal="showProfileEditModal = false"></profile-edit-modal>
  </div>
</template>

<script>
import { computed, ref, onBeforeMount } from '@vue/runtime-core'
import TrendSection from '../components/trends.vue'
import TweetForm from '../components/tweet.vue'
import store from '../store'
import { LIKES_COLLECTION, RETWEET_COLLECTION, TWEET_COLLECTION, USER_COLLECTION } from '../firebase'
import getTweetInfo from '../untils/getTweetInfo'
import moment from 'moment'
import { useRoute } from 'vue-router'
import router from '../router'
import ProfileEditModal from '../components/profileEditModal.vue'
import firebase from 'firebase'

export default {
  components: { TrendSection, TweetForm, ProfileEditModal },
  setup() {
    const currentUser = computed(() => store.state.user)
    const profileUser = ref(null)
    const tweets = ref([])
    const replies = ref([])
    const media = ref([])
    const likes = ref([])
    const currentTab = ref('tweets')
    const showProfileEditModal = ref(false)
    const route = useRoute()

    onBeforeMount(() => {
      const profileUID = route.params.uid ?? currentUser.value.uid

      USER_COLLECTION.doc(profileUID).onSnapshot((doc) => {
        profileUser.value = doc.data()
      })

      TWEET_COLLECTION.where('uid', '==', profileUID)
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            let tweet = await getTweetInfo(change.doc.data(), currentUser.value)

            if (change.type === 'added') {
              tweets.value.splice(change.newIndex, 0, tweet)
            } else if (change.type === 'modified') {
              tweets.value.splice(change.oldIndex, 1, tweet)
            } else if (change.type === 'removed') {
              tweets.value.splice(change.oldIndex, 1)
            }
          })
        })

      RETWEET_COLLECTION.where('uid', '==', profileUID)
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const doc = await TWEET_COLLECTION.doc(change.doc.data().from_tweet_id).get()
            let tweet = await getTweetInfo(doc.data(), currentUser.value)

            if (change.type === 'added') {
              replies.value.splice(change.newIndex, 0, tweet)
            } else if (change.type === 'modified') {
              replies.value.splice(change.oldIndex, 1, tweet)
            } else if (change.type === 'removed') {
              replies.value.splice(change.oldIndex, 1)
            }
          })
        })

      LIKES_COLLECTION.where('uid', '==', profileUID)
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const doc = await TWEET_COLLECTION.doc(change.doc.data().from_tweet_id).get()
            let tweet = await getTweetInfo(doc.data(), currentUser.value)

            if (change.type === 'added') {
              likes.value.splice(change.newIndex, 0, tweet)
            } else if (change.type === 'modified') {
              likes.value.splice(change.oldIndex, 1, tweet)
            } else if (change.type === 'removed') {
              likes.value.splice(change.oldIndex, 1)
            }
          })
        })
    })
    const onFollow = async () => {
      await USER_COLLECTION.doc(currentUser.value.uid).update({
        following: firebase.firestore.FieldValue.arrayUnion(profileUser.value.uid),
      })

      await USER_COLLECTION.doc(profileUser.value.uid).update({
        followers: firebase.firestore.FieldValue.arrayUnion(currentUser.value.uid),
      })

      store.commit('SET_FOLLOW', profileUser.value.uid)
    }

    const onUnfollow = async () => {
      await USER_COLLECTION.doc(currentUser.value.uid).update({
        following: firebase.firestore.FieldValue.arrayRemove(profileUser.value.uid),
      })

      await USER_COLLECTION.doc(profileUser.value.uid).update({
        followers: firebase.firestore.FieldValue.arrayRemove(currentUser.value.uid),
      })

      store.commit('SET_UN_FOLLOW', profileUser.value.uid)
    }

    return { currentUser, tweets, replies, media, likes, moment, currentTab, profileUser, router, showProfileEditModal, onFollow, onUnfollow }
  },
}
</script>

<style>
</style>