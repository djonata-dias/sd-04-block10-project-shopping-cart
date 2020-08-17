export default function requestAPI(url) {
  return (fetch(url).then(response => response
    .json()
    .then((json) => {
      if (response.ok) return Promise.resolve(json);
      return Promise.reject(json);
    }),
  ));
}
