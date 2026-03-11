const Song = require('../song/song.model');
const { getOrSetCache, clearCache } = require('../../shared/utils/cache');

const getAllArtists = async () => {
    return await getOrSetCache('artists:all', async () => {
        return await Artist.find();
    });
};

const getArtistById = async (id) => {
    return await getOrSetCache(`artists:detail:${id}`, async () => {
        const artist = await Artist.findById(id);
        if (!artist) throw new Error('Artist not found');
        return artist;
    });
};

const createArtist = async (artistData) => {
    const newArtist = new Artist(artistData);
    const savedArtist = await newArtist.save();
    await clearCache('artists:all');
    return savedArtist;
};

const updateArtist = async (id, updateData) => {
    const updated = await Artist.findByIdAndUpdate(id, updateData, { new: true });
    await clearCache(`artists:detail:${id}`);
    await clearCache('artists:all');
    return updated;
};

const deleteArtist = async (id) => {
    const deleted = await Artist.findByIdAndDelete(id);
    await clearCache(`artists:detail:${id}`);
    await clearCache('artists:all');
    return deleted;
};

const getTrendingArtists = async (limit = 10) => {
    return await getOrSetCache(`artists:trending:${limit}`, async () => {
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
    });
};

const incrementFollower = async (id) => {
    return await Artist.findByIdAndUpdate(id, { $inc: { followers: 1 } }, { new: true });
};

module.exports = { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist, getTrendingArtists, incrementFollower };
