import { useActiveStream } from '@/hooks/useActiveStream'
import { useLastActiveStream } from '@/hooks/useLastActiveStream'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity, View, ViewProps, Text, Image, Platform, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef } from 'react'
import { getTeamColor } from '../app/mockData'

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const MiniPlayer = ({ style }: ViewProps) => {
    const router = useRouter()
    const activeStream = useActiveStream()
    const lastActiveStream = useLastActiveStream()
    const displayedStream = activeStream ?? lastActiveStream
    const isWeb = Platform.OS === 'web'
    const rotateAnim = useRef(new Animated.Value(0)).current
    const moveAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start()
    }, [])

    useEffect(() => {
        if (!isWeb) {  // Only run animation on mobile
            Animated.loop(
                Animated.timing(moveAnim, {
                    toValue: 1,
                    duration: 5000, // Slowed down to 5 seconds
                    useNativeDriver: false,
                })
            ).start()
        }
    }, [])

    const handlePress = () => {
        router.navigate('/stream')
    }

    if (!displayedStream) return null

    const game = displayedStream.activeStream.game
    const homeScore = game.scores?.home.total ?? '0';
    const awayScore = game.scores?.away.total ?? '0';
    const homeColor = game.teams.home.primaryColor || getTeamColor(game.teams.home.name)
    const awayColor = game.teams.away.primaryColor || getTeamColor(game.teams.away.name)

    // Create animated positions for gradient
    const startX = moveAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 1, 1, 0, 0]
    })

    const startY = moveAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 0, 1, 1, 0]
    })

    const endX = moveAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [1, 1, 0, 0, 1]
    })

    const endY = moveAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [1, 0, 0, 1, 1]
    })

    return (
        <View style={[styles.wrapper, isWeb && styles.webWrapper, style]}>
            <View style={[styles.gradientContainer, isWeb && styles.webContainer]}>
                <View style={styles.gradientWrapper}>
                    {isWeb ? (
                        <LinearGradient
                            colors={[homeColor, awayColor]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradient}
                        />
                    ) : (
                        <AnimatedLinearGradient
                            colors={[homeColor, awayColor, homeColor]}
                            start={{ x: startX, y: startY }}
                            end={{ x: endX, y: endY }}
                            style={styles.gradient}
                        />
                    )}
                </View>
                <TouchableOpacity
                    onPress={handlePress}
                    activeOpacity={0.9}
                    style={[styles.container, isWeb && styles.webContainer]}
                >
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        position: 'absolute',
        left: 8,
        right: 8,
        bottom: Platform.OS === 'ios' ? 30 : 0,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#64a675',
        borderWidth: 3,
        padding: 10,
        borderRadius: 12,
        paddingVertical: Platform.OS === 'ios' ? 25 : 20, // Increase vertical padding for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
        width: '95%',
    },
    webWrapper: {
        alignItems: 'center',
        left: 0,
        right: 0,
        paddingHorizontal: 8,
    },
    webContainer: {
        maxWidth: 850,
        width: '100%',
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
        marginRight: 15,
    },
    gradientContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
    },
    gradientWrapper: {
        position: 'absolute',
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        borderRadius: 15,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
})