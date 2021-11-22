// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { setTimeout } from 'timers/promises';

const hello = async (req, res) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const { data } = req.body;
  const resp = await fetch('http://valkyrie-home.local:8080/predict', {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ data }),
    mode: 'no-cors', // no-cors, *cors, same-origin
    redirect: 'follow',
  })
    .then(async (response) => {
      const final = await response.json();
      res.status(200).json({ data: final });
    })
    .catch((error) => console.log('error', error));
};

export default hello;
