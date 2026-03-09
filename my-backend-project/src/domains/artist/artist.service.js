const Artist = require('./artist.model');
const Song = require('../song/song.model');

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

const getTrendingArtists = async (limit = 10) => {
    const trending = await Song.aggregate([
        {
            $group: {
                _id: "$artist",
                weeklyListenCount: { $sum: "$weeklyListen" }
            }
        },
        { $sort: { weeklyListenCount: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "artists",
                localField: "_id",
                foreignField: "_id",
                as: "artistDetails"
            }
        },
        { $unwind: "$artistDetails" }
    ]);
    return trending.map(t => ({
        ...t.artistDetails,
        weeklyListenCount: t.weeklyListenCount,
        id: t.artistDetails._id
    }));
};

const incrementFollower = async (id) => {
    return await Artist.findByIdAndUpdate(id, { $inc: { followers: 1 } }, { new: true });
};

module.exports = { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist, getTrendingArtists, incrementFollower };
