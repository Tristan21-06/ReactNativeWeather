export const fetchData = async (url) => {
    let res = await fetch(url.href);
    if(res.status !== 200) {
        throw new Error('Failed to fetch data: ' + res.statusText);
    }
    return await res.json();
};