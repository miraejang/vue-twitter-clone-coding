import store from '/src/store'
import { RETWEET_COLLECTION, TWEET_COLLECTION } from '/src/firebase'
import firebase from 'firebase'

export default async tweet => {
  try {
    // already retweeted
    if (tweet.isRetweeted) {
      // Delete retweet doc
      const snapshot = await RETWEET_COLLECTION.where('from_tweet_id', '==', tweet.id)
        .where('uid', '==', store.state.user.uid)
        .get()
      await snapshot.docs[0].ref.delete()
      // Decrease retweet number
      await TWEET_COLLECTION.doc(tweet.id).update({
        num_retweets: firebase.firestore.FieldValue.increment(-1),
      })
    } else {
      // not retweeted
      const doc = RETWEET_COLLECTION.doc()
      await doc.set({
        id: doc.id,
        from_tweet_id: tweet.id,
        uid: store.state.user.uid,
        created_at: Date.now(),
      })

      await TWEET_COLLECTION.doc(tweet.id).update({
        num_retweets: firebase.firestore.FieldValue.increment(1),
      })
    }
  } catch (e) {
    console.log('handle retweet error: ', e)
  }
}
