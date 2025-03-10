import { useActiveStream } from '@/hooks/useActiveStream'
import { useLastActiveStream } from '@/hooks/useLastActiveStream'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity, View, ViewProps, Text, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const MiniPlayer = ({ style }: ViewProps) => {
    const router = useRouter()
    const activeStream = useActiveStream()
    const lastActiveStream = useLastActiveStream()
    const displayedStream = activeStream ?? lastActiveStream

    const handlePress = () => {
        router.navigate('/stream')
    }

    if (!displayedStream) return null

    const game = displayedStream.activeStream.game
    const homeScore = game.scores?.home.total ?? '0';
    const awayScore = game.scores?.away.total ?? '0';

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={[styles.container, style]}>
            <View style={styles.scoreContainer}>
                <Image
                    source={{ uri: game.teams.away.logo }}
                    style={styles.teamLogo}
                    resizeMode="contain"
                />
                <Text style={styles.scoreText}>
                    {`${awayScore} - ${homeScore}`}
                </Text>
                <Image
                    source={{ uri: game.teams.home.logo }}
                    style={styles.teamLogo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.trackTitleContainer}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                    {displayedStream.activeStream?.title}
                </Text>
            </View>

            <View style={styles.controls}>
                <Ionicons name="volume-mute" size={24} color="#203024" />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 12,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
    },
    trackTitleContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    trackTitle: {
        fontSize: 18,
        fontWeight: '600',
        paddingLeft: 15,
        color: '#000000',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
        paddingLeft: 10,
    },
    teamLogo: {
        width: 24,
        height: 24,
        borderRadius: 4,
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
})
