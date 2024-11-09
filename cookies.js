function getCookie(name) 
{
	const cookieArr = document.cookie.split("; ");
	for (let cookie of cookieArr) 
	{
		const [key, value] = cookie.split("=");
		if (key === name) 
		{
			return decodeURIComponent(value);
		}
	}
	return null;
}

function setCookie(name, value, expireTime, path="") 
{
	let expires = "expires="
	if(expireTime == undefined)
	{
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999); 
		expires += endOfDay.toUTCString();
	}
	else
	{
		// Assumes expire time is in days
		const expires = new Date(Date.now() + expireTime * 864e5).toUTCString();
	}

	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; SameSite=Lax; path=/${path}`;
}


function deleteCookie(name) 
{
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}