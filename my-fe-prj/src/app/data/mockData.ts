export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  audioUrl?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: number;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  followers: string;
  genre: string;
}

export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "The Velvet Notes",
    album: "Nocturnal Sessions",
    duration: "3:45",
    coverUrl: "https://images.unsplash.com/photo-1644855640845-ab57a047320e?w=400",
  },
  {
    id: "2",
    title: "Electric Pulse",
    artist: "Neon Waves",
    album: "Synthetic Hearts",
    duration: "4:12",
    coverUrl: "https://images.unsplash.com/photo-1692176548571-86138128e36c?w=400",
  },
  {
    id: "3",
    title: "Urban Rhythm",
    artist: "Street Poets",
    album: "City Lights",
    duration: "3:28",
    coverUrl: "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=400",
  },
  {
    id: "4",
    title: "Summer Vibes",
    artist: "Luna Sky",
    album: "Golden Hours",
    duration: "3:56",
    coverUrl: "https://images.unsplash.com/photo-1730875651456-9c9cde899602?w=400",
  },
  {
    id: "5",
    title: "Jazz Nights",
    artist: "The Blue Notes",
    album: "Smooth Sessions",
    duration: "5:23",
    coverUrl: "https://images.unsplash.com/photo-1641185867887-e8a0c79214b9?w=400",
  },
  {
    id: "6",
    title: "Rock Anthem",
    artist: "Thunder Road",
    album: "Electric Storm",
    duration: "4:45",
    coverUrl: "https://images.unsplash.com/photo-1717978227318-8ff6ee93bcf5?w=400",
  },
];

export const mockAlbums: Album[] = [
  {
    id: "1",
    title: "Nocturnal Sessions",
    artist: "The Velvet Notes",
    coverUrl: "https://images.unsplash.com/photo-1644855640845-ab57a047320e?w=400",
    year: 2024,
    songs: [mockSongs[0]],
  },
  {
    id: "2",
    title: "Synthetic Hearts",
    artist: "Neon Waves",
    coverUrl: "https://images.unsplash.com/photo-1692176548571-86138128e36c?w=400",
    year: 2023,
    songs: [mockSongs[1]],
  },
  {
    id: "3",
    title: "City Lights",
    artist: "Street Poets",
    coverUrl: "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=400",
    year: 2024,
    songs: [mockSongs[2]],
  },
  {
    id: "4",
    title: "Golden Hours",
    artist: "Luna Sky",
    coverUrl: "https://images.unsplash.com/photo-1730875651456-9c9cde899602?w=400",
    year: 2025,
    songs: [mockSongs[3]],
  },
  {
    id: "5",
    title: "Smooth Sessions",
    artist: "The Blue Notes",
    coverUrl: "https://images.unsplash.com/photo-1641185867887-e8a0c79214b9?w=400",
    year: 2023,
    songs: [mockSongs[4]],
  },
  {
    id: "6",
    title: "Electric Storm",
    artist: "Thunder Road",
    coverUrl: "https://images.unsplash.com/photo-1717978227318-8ff6ee93bcf5?w=400",
    year: 2024,
    songs: [mockSongs[5]],
  },
];

export const mockArtists: Artist[] = [
  {
    id: "1",
    name: "The Velvet Notes",
    imageUrl: "https://images.unsplash.com/photo-1644855640845-ab57a047320e?w=400",
    followers: "1.2M",
    genre: "Alternative",
  },
  {
    id: "2",
    name: "Neon Waves",
    imageUrl: "https://images.unsplash.com/photo-1692176548571-86138128e36c?w=400",
    followers: "850K",
    genre: "Electronic",
  },
  {
    id: "3",
    name: "Street Poets",
    imageUrl: "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=400",
    followers: "2.3M",
    genre: "Hip Hop",
  },
  {
    id: "4",
    name: "Luna Sky",
    imageUrl: "https://images.unsplash.com/photo-1730875651456-9c9cde899602?w=400",
    followers: "1.8M",
    genre: "Pop",
  },
  {
    id: "5",
    name: "The Blue Notes",
    imageUrl: "https://images.unsplash.com/photo-1641185867887-e8a0c79214b9?w=400",
    followers: "600K",
    genre: "Jazz",
  },
  {
    id: "6",
    name: "Thunder Road",
    imageUrl: "https://images.unsplash.com/photo-1717978227318-8ff6ee93bcf5?w=400",
    followers: "1.5M",
    genre: "Rock",
  },
];
