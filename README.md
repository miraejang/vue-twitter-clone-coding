# Twitter
Vue.js를 활용한 트위터 클론 코딩 입니다.   
　   
### 이 과정을 통해 얻은 것
- vue3 문법의 구조를 익힐 수 있었습니다.
- 비동기의 활용에 대한 이해도를 높일 수 있었습니다.
- database에 저장하고 사용하는 것을 배울 수 있었습니다.   
　   
### 사용한 기술 
- Vue3
- Tailwind CSS
- Firebase   
　   
## 구현한 기능 설명
### 회원가입
- Firebase 연결하여 회원가입 할 수 있습니다.   
　    
### 로그인 & 로그아웃
- 회원가입 하신 후에 해당 정보로 로그인 할 수 있습니다.   
- 로그인해야 뜨위떠를 사용할 수 있습니다.   
- 로그아웃 할 수 있습니다. 좌측 메뉴 하단의 버튼을 통해 로그아웃이 가능합니다.
　    
### 기능
- 트위터를 작성할 수 있습니다
  - 좌측 메뉴바의 Tweet 버튼을 이용하여 작성할 수 있습니다.
  - Home에서 작성할 수 있습니다.
- 댓글을 작성 할 수 있습니다.
- 리트윗과 좋아요를 할 수 있습니다. 이 기능은 카운트됩니다.

### 페이지
뜨위떠는 이동할 수 있는 몇 가지 페이지가 존재합니다.   
페이지는 좌측 메뉴를 클릭하여 이동할 수 있습니다.   

#### Home
뜨위떠의 기본 페이지입니다.   
모든 사용자의 트윗이 보입니다.  

- 트윗은 작성자, 작성된 시간, 내용이 보여집니다.
- 트윗의 내용을 클릭하면 해당 트윗 페이지로 이동합니다.
- 계정 프로필 이미지를 클릭하면 해당 계정의 프로필 페이지로 이동합니다.
- 댓글 아이콘을 클릭하면 댓글을 입력할 수 있는 모달이 팝업됩니다.
- 리트윗, 좋아요를 클릭하면 카운트가 됩니다.
　   
#### Notifications
팔로우한 계정이 7일 이내에 남긴 트윗을 보여줍니다.   
　   
#### Messages
좌측에는 메시지를 보낼 수 있는 계정 리스트가 보입니다.   
우측에는 메시지를 주고받는 창이 보입니다.   
　   
#### Profile
현재 아이디와 관련된 정보가 보입니다.   
다른 사용자의 계정 페이지도 트윗의 프로필 이미지 클릭으로 이동할 수 있습니다.   

- **Edit profile** 버튼을 클릭하여 계정의 배경 이미지와 프로필 이미지를 수정할 수 있습니다.
- **Tab menu**로 관련된 정보를 나눠서 볼 수 있습니다.
  |Tab Menu|description|
  |:-:|:-:|
  |Tweets|현재 아이디로 현재까지 남긴 트윗이 보입니다.|
  |Tweets & replies|현재 아이디로 현재까지 리트윗한 모든 트윗이 보입니다.|
  |Likes|현재 아이디로 현재까지 좋아요한 모든 트윗이 보입니다.|
