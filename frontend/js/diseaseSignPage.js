// 회원가입
async function signUp() {
  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account, password, passwordconfirm }),
    });

    const data = await response.json();
    console.log(data); // 회원가입 결과 확인
  } catch (error) {
    console.error('Error:', error);
  }
}

// 로그인
async function signIn() {
  try {
    const response = await fetch('http://localhost:3000/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account, password }),
    });

    const data = await response.json();
    console.log(data); // 로그인 결과 확인
  } catch (error) {
    console.error('Error:', error);
  }
}

// 로그아웃
async function signOut() {
  try {
    const response = await fetch('http://localhost:3000/api/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data); // 로그아웃 결과 확인
  } catch (error) {
    console.error('Error:', error);
  }
}
