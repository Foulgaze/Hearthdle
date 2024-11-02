function getCookie(name) 
{
	const cookieArr = document.cookie.split("; ");
	for (let cookie of cookieArr) {
		const [key, value] = cookie.split("=");
		if (key === name) {
			return decodeURIComponent(value);
		}
	}
	return null;
}

function setCookie(name, value, days = 7) 
{
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function deleteCookie(name) 
{
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}