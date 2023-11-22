export async function register (un, pw) {
    let data;
    let x = new FormData();
    x.append('userid', un);
    x.append('password', pw);
    const result = await fetch("https://cpsc345sh.jayshaffstall.com/register.php", {method: "POST", body: x});

    if (result.ok) {
        data = await result.json();
    }
    else {
        console.log(result.error);
        return {error: result.error};
    }

    if (data.token === undefined) {
        return {error: data.error};
    }
    return {token: data.token};
};

export async function login (un, pw) {
    let data;
    const x = new FormData();
    x.append('userid', un);
    x.append('password', pw);
    const result = await fetch("https://cpsc345sh.jayshaffstall.com/login.php", {method: "POST", body: x});
    
    if (result.ok) {
        data = await result.json();
    }
    else {
        console.log('error: ' + result.error);
        return {error: result.error};
    }
    if (data.token === undefined) {
        return {error: data.error};
    }
    
    return {token: data.token};
}

//template function for requests

export async function apiCall (api, body) {
    let x = new FormData();

    for (const key in body) {
        if (body.hasOwnProperty(key)) {
          x.append(key, body[key]);
        }
      }

    let apiLink = 'https://cpsc345sh.jayshaffstall.com/' + api;

    const result = await fetch(apiLink, {method: "POST", body: x});
    let data;

    if (result.ok) {
        data = await result.json();
        return data;
    }
    return null;
}
