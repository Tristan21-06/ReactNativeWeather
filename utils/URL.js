export const buildWeatherUrl = (url, city) => {
    let builtUrl = new URL(url);
    builtUrl.searchParams.append('q', city);
    builtUrl.searchParams.append('units', 'metric');
    builtUrl.searchParams.append('lang', 'fr');
    builtUrl.searchParams.append('appid', "6ac4ac217b24e462da817e583a81f929");

    return builtUrl;
}

export const buildGeoPosUrl = (url, {lat, lon}) => {
    let builtUrl = new URL(url);
    builtUrl.searchParams.append('lat', lat);
    builtUrl.searchParams.append('lon', lon);
    builtUrl.searchParams.append('limit', '1');
    builtUrl.searchParams.append('lang', 'fr');
    builtUrl.searchParams.append('appid', "6ac4ac217b24e462da817e583a81f929");

    return builtUrl;
}