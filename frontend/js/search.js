async function getInfomationFromServer() {
  try {
    const nickname = document.querySelector('#lol-id');
    const response = await fetch(
      `http://localhost:3000/api/search/${nickname}`,
    );
    const information = await response.json();
    if (response.status !== 200) {
      //try catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
      throw new Error(information.message);
    }
    addInfo(information);
  } catch (error) {
    console.log(error.message);
    alert(error.message);
  }
}

function addInfo(info) {
  const html = `
        <li class = "info">랭크 : ${info.final.rankInformation}</li>
        <li class = "info">전적 : ${info.final.gameInformation}</li>`;
  const infoList = document.querySelector('.infoList');
  infoList.innerHTML = html;
}

const putBtn = document.querySelector('.btn-outline-primary');
putBtn.addEventListener('click', () => {
  getInfomationFromServer();
});
