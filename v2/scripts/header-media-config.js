(()=>{
  const tmdb=path=>`https://image.tmdb.org/t/p/original${path}`;
  const backdrops={
    '1975-1999:1':'https://image.tmdb.org/t/p/original/aJCtkxLLzkk1pECehVjKHA2lBgw.jpg',
    '1975-1999:2':'https://image.tmdb.org/t/p/original/9Qs9oyn4iE8QtQjGZ0Hp2WyYNXT.jpg',
    '1975-1999:3':'https://image.tmdb.org/t/p/original/c7Mjuip0jfHLY7x8ZSEriRj45cu.jpg',
    '1975-1999:4':'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    '1975-1999:5':'https://image.tmdb.org/t/p/original/36P236xmuc8aWmXK7YkOM5EAKbA.jpg',

    '2000-2024:1':tmdb('/oiwc338EoBgS4sEI2ixAny4KQKg.jpg'),
    '2000-2024:2':tmdb('/hwNtEmmugU5Yd7hpfprNWI0DGIn.jpg'),
    '2000-2024:3':tmdb('/dyJvKsNs2KP8qQnAXbRwDjblViy.jpg'),
    '2000-2024:4':tmdb('/1PXwh3nJzgRkkYnqfWInJNypeL4.jpg'),
    '2000-2024:5':tmdb('/9FE5eD92WfVCiivM9Pq9GVSrlWk.jpg'),

    'sci-fi-realiste:1':tmdb('/www52jvhbB0ppe9s0zxbf9EYox.jpg'),
    'sci-fi-realiste:2':tmdb('/hPsCR1ny6GnctJkWqeJwihTDD7T.jpg'),
    'sci-fi-realiste:3':tmdb('/qr7dUqleMRd0VgollazbmyP9XjI.jpg'),
    'sci-fi-realiste:4':tmdb('/nLFxvLokHe3bQmrmAfljIfax2jQ.jpg'),
    'sci-fi-realiste:5':tmdb('/tlm8UkiQsitc8rSuIAscQDCnP8d.jpg'),

    'animation:1':tmdb('/fK40VGYIm7hmKrLJ26fgPQU0qRG.jpg'),
    'animation:2':tmdb('/dyJvKsNs2KP8qQnAXbRwDjblViy.jpg'),
    'animation:3':tmdb('/8mnXR9rey5uQ08rZAvzojKWbDQS.jpg'),
    'animation:4':tmdb('/xWT5F1DNxciNLEMXRl49iq8zvN7.jpg'),
    'animation:5':tmdb('/3Rfvhy1Nl6sSGJwyjb0QiZzZYlB.jpg'),

    'biopics:1':tmdb('/7TF4p86ZafnxFuNqWdhpHXFO244.jpg'),
    'biopics:2':tmdb('/zb6fM1CX41D9rF9hdgclu0peUmy.jpg'),
    'biopics:3':tmdb('/1PXwh3nJzgRkkYnqfWInJNypeL4.jpg'),
    'biopics:4':tmdb('/sfW8gtA6Bz2F4zK1FoCKbMqTF8Z.jpg'),
    'biopics:5':tmdb('/kYlBNDkB5qFdpTDpnlQdH0CdK3T.jpg'),

    'documentaires:1':tmdb('/70uUnpfe7en9x011UjpZoub101l.jpg'),
    'documentaires:2':tmdb('/8RafTGqYqAN9FJzvC75USKmJCso.jpg'),
    'documentaires:3':tmdb('/sW7VOrkHKYIeV9PaYc5IqGU2XK8.jpg'),
    'documentaires:4':tmdb('/z2uuQasY4gQJ8VDAFki746JWeQJ.jpg'),
    'documentaires:5':tmdb('/yKEe2nFu4fRYcmVdeAwZxTZvP3g.jpg'),

    'rewatched:1':tmdb('/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg'),
    'rewatched:2':tmdb('/oiwc338EoBgS4sEI2ixAny4KQKg.jpg'),
    'rewatched:3':tmdb('/5bzPWQ2dFUl2aZKkp7ILJVVkRed.jpg'),
    'rewatched:4':tmdb('/yQ0Nn4KIiLf60LTMDjEhRzPqTta.jpg'),
    'rewatched:5':tmdb('/ih2xVgeMS8R5WUetYE8Mr9hVTlB.jpg')
  };

  // Portrait optical crops. These are intentionally editorial rather than mathematically centered:
  // faces / figures sit above the film-name block and iconic negative space is preserved where useful.
  const mobileFocus={
    '1975-1999:1':'50% 43%',
    '1975-1999:2':'50% 45%',
    '1975-1999:3':'54% 43%',
    '1975-1999:4':'50% 42%',
    '1975-1999:5':'50% 41%',

    '2000-2024:1':'50% 41%',
    '2000-2024:2':'50% 40%',
    '2000-2024:3':'50% 43%',
    '2000-2024:4':'54% 38%',
    '2000-2024:5':'50% 40%',

    'sci-fi-realiste:1':'52% 42%',
    'sci-fi-realiste:2':'50% 42%',
    'sci-fi-realiste:3':'46% 45%',
    'sci-fi-realiste:4':'50% 42%',
    'sci-fi-realiste:5':'50% 39%',

    'animation:1':'57% 44%',
    'animation:2':'50% 43%',
    'animation:3':'50% 42%',
    'animation:4':'50% 39%',
    'animation:5':'50% 40%',

    'biopics:1':'50% 39%',
    'biopics:2':'52% 41%',
    'biopics:3':'54% 38%',
    'biopics:4':'50% 40%',
    'biopics:5':'54% 40%',

    'documentaires:1':'50% 42%',
    'documentaires:2':'50% 42%',
    'documentaires:3':'52% 45%',
    'documentaires:4':'44% 43%',
    'documentaires:5':'50% 42%',

    'rewatched:1':'50% 43%',
    'rewatched:2':'50% 41%',
    'rewatched:3':'50% 42%',
    'rewatched:4':'50% 42%',
    'rewatched:5':'50% 40%'
  };

  const key=(top,film)=>`${top?.id||''}:${film?.rank??''}`;
  window.ASWA40_HEADER_MEDIA={
    backdrops,
    mobileFocus,
    key,
    backdrop:(top,film)=>backdrops[key(top,film)]||'',
    focusMobile:(top,film)=>mobileFocus[key(top,film)]||'50% 50%'
  };
})();
