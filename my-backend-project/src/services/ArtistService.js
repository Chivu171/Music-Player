const Artist = require('../models/Artist');

const getAllArtists = async () => {
    return await Artist.find();
};

const getArtistById = async (id) => {
    const artist = await Artist.findById(id);
    if (!artist) throw new Error('Artist not found');
    return artist;
};

const createArtist = async (artistData) => {
    const newArtist = new Artist(artistData);
    return await newArtist.save();
};

const updateArtist = async (id, updateData) => {
    return await Artist.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteArtist = async (id) => {
    return await Artist.findByIdAndDelete(id);
};

module.exports = { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist };
