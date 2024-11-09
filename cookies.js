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

function setCookie(name, value) 
{
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); 
    const expires = "expires=" + endOfDay.toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; SameSite=Lax; path=/`;
}

function setCookieExperiationDate(name, value, date)
{
	
}

function deleteCookie(name) 
{
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}