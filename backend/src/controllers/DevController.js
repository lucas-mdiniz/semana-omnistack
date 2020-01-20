const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, store, update, destroy

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      //Filtrar as conexões que estão ha no máximo 10km de distância e que tenha ao menos uma das techs

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return res.json(dev);
  },

  async update(req, res) {
    let dev = await Dev.findById(req.params.id);

    const {
      techs = dev.techs,
      name = dev.name,
      avatar_url = dev.avatar_url,
      bio = dev.bio,
      latitude = dev.latitude,
      longitude = dev.longitude
    } = req.body;

    console.log(dev);

    const devData = {
      techs,
      name,
      avatar_url,
      bio,
      latitude,
      longitude
    };

    dev = await Dev.findByIdAndUpdate(req.params.id, devData, {
      new: true
    });

    return res.json(dev);
  },

  async destroy(req, res) {
    await Dev.findByIdAndRemove(req.params.id);

    return res.send();
  }
};
