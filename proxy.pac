function FindProxyForURL(url, host)
{
    //var keyword = url.toLowerCase().indexOf("Siri");
    //if (dnsDomainIs(host, "google.ca") && (keyword >= 0) && url.toLowerCase().indexOf("search?q=") >= 0)	{
	if (url.indexOf('google') != -1) {
    	return "PROXY 192.168.1.103:9000";
    }
	return "DIRECT";
}
