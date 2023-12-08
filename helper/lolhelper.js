require('dotenv').config();
let encryptedSummonerId = '';
let puuid = '';

//encryptedSummonerId, puuid 가져오기: SUMMONER-V4
//https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}
async function getEncryptedSummonerId(lol_nickname) {
  lol_nickname = encodeURIComponent(lol_nickname);
  const api =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
    lol_nickname +
    '?api_key=' +
    process.env.RIOT_API;

  function getApi() {
    const response = fetch(api);
    return response.then((res) => res.json());
  }

  async function exec() {
    let rankInformation = [];
    let gameInformation = [];
    try {
      let data = await getApi();
      encryptedSummonerId = data.id;
      puuid = data.puuid;
      rankInformation = await getRankInformation(encryptedSummonerId);
      gameInformation = await getRecentMatch(puuid);
      return { rankInformation, gameInformation };
    } catch (error) {
      console.log(error);
      return;
    }
  }

  let result = await exec();
  return result;
}

//반환받은 encryptedSummonerId 이용해서 랭크 정보 가져오기: LEAGUE-V4
//https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedSummonerId}
async function getRankInformation(encryptedSummonerId) {
  const api =
    'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' +
    encryptedSummonerId +
    '?api_key=' +
    process.env.RIOT_API;

  function getApi() {
    const response = fetch(api);
    return response.then((res) => res.json());
  }

  async function exec() {
    let rankInformation = [];
    try {
      let data = await getApi();
      for (let i = 0; i < data.length; i++) {
        if (data[i].queueType === 'RANKED_FLEX_SR') data[i].queueType = '자랭';
        else if (data[i].queueType === 'RANKED_SOLO_5x5')
          data[i].queueType = '솔랭';
        if (
          data[i].tier === 'MASTER' ||
          data[i].tier === 'GRANDMASTER' ||
          data[i].tier === 'CHALLENGER'
        )
          data[i].rank = '';
        let oneRankInfo = {
          summonerName: data[i].summonerName,
          queueType: data[i].queueType,
          tier: data[i].tier,
          rank: data[i].rank,
          point: data[i].leaguePoints,
          wins: data[i].wins,
          losses: data[i].losses,
          ratio: (
            (data[i].wins * 100) /
            (data[i].wins + data[i].losses)
          ).toFixed(1),
        };
        rankInformation.push(oneRankInfo);
      }
      return rankInformation;
    } catch (error) {
      console.log(error);
      return;
    }
  }
  let result = await exec();
  return result;
}

//반환받은 puuid 이용해서 최근 5게임의 game id 가져오기: MATCH-V5-1
//https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10&api_key=
async function getRecentMatch(puuid) {
  const api =
    'https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/' +
    puuid +
    '/ids?start=0&count=5&api_key=' +
    process.env.RIOT_API;

  function getApi() {
    const response = fetch(api);
    return response.then((res) => res.json());
  }

  async function exec() {
    let gameInformation = [];
    try {
      let data = await getApi();
      for (let i = 0; i < data.length; i++) {
        let oneMatchResult = await getMatchDetailInfo(data[i], puuid);
        gameInformation.push(oneMatchResult);
      }
      return gameInformation;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  let gameInfo = await exec();
  return gameInfo;
}

//각 게임 id 이용해서 해당 게임 정보 가져오기: MATCH-V5-2
//https://asia.api.riotgames.com/lol/match/v5/matches/{matchId}&api_key=
async function getMatchDetailInfo(matchId, puuid) {
  const api =
    'https://asia.api.riotgames.com/lol/match/v5/matches/' +
    matchId +
    '?api_key=' +
    process.env.RIOT_API;

  function getApi() {
    const response = fetch(api);
    return response.then((res) => res.json());
  }

  async function exec() {
    try {
      let data = await getApi();
      const date = new Date(data.info.gameCreation);
      const formattedDate = date.toLocaleDateString('ko-KR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }); //timestamp 가공
      const durationMin = Math.floor(data.info.gameDuration / 60);
      const durationSec = data.info.gameDuration % 60; // 게임 시간 가공
      let playerList = [];
      let myWin = 'true';
      let myChampion = '';
      let myKill = 0;
      let myDeath = 0;
      let myAssist = 0;
      for (let i = 0; i < data.info.participants.length; i++) {
        if (puuid === data.info.participants[i].puuid) {
          myWin = data.info.participants[i].win;
          myChampion = data.info.participants[i].championName;
          myKill = data.info.participants[i].kills;
          myDeath = data.info.participants[i].deaths;
          myAssist = data.info.participants[i].assists;
        }
        playerList.push(
          data.info.participants[i].riotIdGameName +
            ' #' +
            data.info.participants[i].riotIdTagline,
        );
      }
      let oneGameInfo = {
        gameMode: data.info.gameMode,
        gameType: data.info.gameType,
        gameCreation: formattedDate,
        gameDuration: String(durationMin) + '분 ' + String(durationSec) + '초',
        //winTeams: winTeam,
        playerList,
        myWin,
        myChampion,
        myKill,
        myDeath,
        myAssist,
      };
      return oneGameInfo;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  let gameInfo = await exec();
  return gameInfo;
}

//console.log(await getEncryptedSummonerId('아오 플쌤'));
module.exports = { getEncryptedSummonerId };
