// 정보조회
async function getInfomationFromServer() {
  try {
    const response = await fetch(`http://localhost:3000/api/users/me`, {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcwMDk5MzgxNiwiZXhwIjoxNzAxMDM3MDE2fQ.WWXqbt1_zhjDgPCex7i6disV9p8XZIX5coYzf2SSdWc"
            // 위에 있는 Au~~ 이 코드는 강제로 토큰을 넣은 방식
            // 세웅님이 로컬스토리지에 토큰을 생성해주시면 밑에 있는  코드 사용
            // Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
    });
    const information = await response.json();
    if (response.status !== 200) {
        //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
        throw new Error(information.message);
    }
    document.cookie;
    addInfo(information);
  } catch (error) {
      //console.log(error.message);
      alert(error.message);
  }
}
getInfomationFromServer();


// 홈페이지에 나의 정보를 볼 수 있게 해주는 함수
function addInfo(info) {
  const html =
    `<li class = "info">이름 : ${info.name}</li>
    <li class = "info">롤닉네임 : ${info.nickname}</li>
    <li class = "info">한줄소개 : ${info.oneLiner}</li>`
  const infoList = document.querySelector(".infoList")
  infoList.innerHTML = html;
}

// 정보수정
async function putInfomation() {
  const nickname = document.querySelector("#nickname");
  const oneLiner = document.querySelector("#oneLiner");
  const password = document.querySelector("#password");
  const passwordconfirm = document.querySelector("#passwordconfirm");
  
  try {
    const newInformation = {
      nickname: nickname.value,
      oneLiner: oneLiner.value,
      password: password.value,
      passwordconfirm: passwordconfirm.value
    }
    const response = await fetch(`http://localhost:3000/api/users/me`, {
      method: "put",
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcwMDk5MzgxNiwiZXhwIjoxNzAxMDM3MDE2fQ.WWXqbt1_zhjDgPCex7i6disV9p8XZIX5coYzf2SSdWc",
        // 위에 있는 Au~~ 이 코드는 강제로 토큰을 넣은 방식
        // 세웅님이 로컬스토리지에 토큰을 생성해주시면 밑에 있는  코드 사용
        // Authorization: `Bearer ${localStorage.getItem("token")}`
          
        //내가 제이슨 형태로 데이터를 보낸다고 알려주는 코드
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInformation)
    });
    const information = await response.json();
    if (response.status !== 200) {
      //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
      throw new Error(information.message);
    }
    addInfo(information);
    alert(`${information.message}`);
    window.location.reload();
  } catch (error) {
      //console.log(error.message);
      alert(error.message);
      nickname.value= "";
      oneLiner.value= "";
      password.value= "";
      passwordconfirm.value= "";
  }    
}


const topTableText = document.querySelector(".topTableText");
const topBtn = document.querySelector(".topBtn");
const topBox = document.querySelector(".topBox");
const popup = document.querySelector(".popup");

// 정보수정하기 버튼을 누르면 정보수정창으로 띄우기
topBtn.addEventListener("click", () => {
  topTableText.style.visibility = "hidden";
  topBtn.style.visibility = "hidden";
  topBox.style.visibility = "hidden";
  popup.style.display = "block";
})


const putBtn = document.querySelector(".putBtn");
// 마우스로 클릭하여 정보수정완료하기
putBtn.addEventListener("click", () => {
  putInfomation();
})
