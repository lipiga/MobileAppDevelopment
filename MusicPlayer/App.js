import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Switch,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const sidebarPosition = useState(new Animated.Value(-width * 0.7))[0];

  useEffect(() => {
    fetchMusic();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sidebarVisible) {
      Animated.timing(sidebarPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sidebarPosition, {
        toValue: -width * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [sidebarVisible]);

  const fetchMusic = async () => {
    try {
      const response = await fetch(
        "https://itunes.apple.com/search?term=karthik+tamil&entity=song&limit=15"
      );
      const data = await response.json();
      setTracks(data.results);
      if (data.results.length > 0) {
        setCurrentTrack(data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching music:", error);
    } finally {
      setLoading(false);
    }
  };

  const playMusic = async (track) => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: track.previewUrl },
      { shouldPlay: false } // don't auto-play yet
    );

    // Always start from the beginning
    await newSound.setPositionAsync(0);
    await newSound.playAsync();

    setSound(newSound);
    setCurrentTrack(track);
    setIsPlaying(true);

    // Set up periodic updates for progress
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        const newProgress = status.durationMillis
          ? status.positionMillis / status.durationMillis
          : 0;
        setProgress(newProgress);

        if (status.didJustFinish && !status.isLooping) {
          if (isRepeating) {
            newSound.replayAsync(); // replay if repeat mode is on
          } else {
            setIsPlaying(false);
            setProgress(0); // reset progress bar
          }
        }
      }
    });
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};


  const togglePlayPause = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.trackId === currentTrack.trackId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playMusic(tracks[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.trackId === currentTrack.trackId);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playMusic(tracks[prevIndex]);
  };

  const toggleRepeat = () => {
    if (sound) {
      sound.setIsLoopingAsync(!isRepeating);
    }
    setIsRepeating(!isRepeating);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 50 && !sidebarVisible) {
        setSidebarVisible(true);
      } else if (gestureState.dx < -50 && sidebarVisible) {
        setSidebarVisible(false);
      }
    },
  });

  const themeStyles = darkMode ? styles.dark : styles.light;
  const textColor = darkMode ? "#fff" : "#000";
  const secondaryTextColor = darkMode ? "#aaa" : "#555";
  const cardBgColor = darkMode ? "#222" : "#f2f2f2";

  return (
    <View style={[styles.container, themeStyles]} {...panResponder.panHandlers}>
      <StatusBar style={darkMode ? "light" : "dark"} />

      {/* Sidebar */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { backgroundColor: darkMode ? "#111" : "#fff", transform: [{ translateX: sidebarPosition }] }
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={[styles.sidebarTitle, { color: textColor }]}>Playlist</Text>
          <TouchableOpacity onPress={() => setSidebarVisible(false)}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.trackId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.sidebarItem,
                { backgroundColor: currentTrack?.trackId === item.trackId ? 
                  (darkMode ? "#333" : "#ddd") : "transparent" 
                }
              ]}
              onPress={() => {
                playMusic(item);
                setSidebarVisible(false);
              }}
            >
              <Image source={{ uri: item.artworkUrl60 }} style={styles.sidebarImage} />
              <View style={styles.sidebarInfo}>
                <Text
                  style={{ color: textColor, fontSize: 14 }}
                  numberOfLines={1}
                >
                  {item.trackName}
                </Text>
                <Text style={{ color: secondaryTextColor, fontSize: 12 }}>
                  {item.artistName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      {/* Overlay to close sidebar when clicking on main content */}
      {sidebarVisible && (
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setSidebarVisible(false)}
        />
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu" size={28} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>
            🎵 Music Player
          </Text>
          <View style={styles.switchContainer}>
            <Ionicons 
              name={darkMode ? "moon" : "sunny"} 
              size={20} 
              color={textColor} 
            />
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              thumbColor={darkMode ? "#fff" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#4a4a4a" }}
            />
          </View>
        </View>

        {/* Now Playing */}
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#00f" />
          </View>
        ) : currentTrack ? (
          <View style={styles.playerContainer}>
            {/* Album Art */}
            <View style={styles.albumArtContainer}>
              <Image 
                source={{ uri: currentTrack.artworkUrl100.replace("100x100", "300x300") }} 
                style={styles.albumArt}
              />
            </View>

            {/* Track Info */}
            <View style={styles.trackInfo}>
              <Text style={[styles.trackName, { color: textColor }]} numberOfLines={1}>
                {currentTrack.trackName}
              </Text>
              <Text style={[styles.artistName, { color: secondaryTextColor }]}>
                {currentTrack.artistName}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: darkMode ? "#333" : "#ddd" }]}>
                <View 
                  style={[
                    styles.progress, 
                    { width: `${progress * 100}%`, backgroundColor: darkMode ? "#4a8c54" : "#1db954" }
                  ]} 
                />
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={toggleRepeat}>
                <Ionicons 
                  name="repeat" 
                  size={28} 
                  color={isRepeating ? (darkMode ? "#4a8c54" : "#1db954") : secondaryTextColor} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={playPrevious}>
                <Ionicons name="play-skip-back" size={32} color={textColor} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.playButton}
                onPress={togglePlayPause}
              >
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={36} 
                  color={darkMode ? "#000" : "#fff"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={playNext}>
                <Ionicons name="play-skip-forward" size={32} color={textColor} />
              </TouchableOpacity>
              
              <TouchableOpacity>
                <FontAwesome5 name="heart" size={24} color={secondaryTextColor} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Text style={{ color: textColor }}>No tracks available</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold",
  },
  switchContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    gap: 5,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.7,
    zIndex: 100,
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sidebarItem: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  sidebarImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  sidebarInfo: {
    marginLeft: 12,
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 90,
  },
  playerContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  albumArtContainer: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  trackInfo: {
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
  },
  trackName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  artistName: {
    fontSize: 18,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 30,
  },
  progressBar: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1db954",
    justifyContent: "center",
    alignItems: "center",
  },
  light: { backgroundColor: "#fff" },
  dark: { backgroundColor: "#000" },
});
