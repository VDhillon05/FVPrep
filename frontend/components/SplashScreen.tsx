import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const ANIMATION_MS = 1500;

type Props = {
  onAnimationEnd: () => void;
};

export default function SplashScreen({ onAnimationEnd }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;
  const ended = useRef(false);

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIMATION_MS,
        useNativeDriver: true,
      }),
    ]);

    anim.start(({ finished }) => {
      if (finished && !ended.current) {
        ended.current = true;
        onAnimationEnd();
      }
    });

    return () => anim.stop();
  }, [opacity, scale, onAnimationEnd]);

  return (
    <View style={styles.root} accessibilityLabel="FVPrep loading">
      <Animated.Text style={[styles.mark, { opacity, transform: [{ scale }] }]}>
        FV
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  mark: {
    color: "#ffffff",
    fontSize: 72,
    fontWeight: "700",
    letterSpacing: 4,
  },
});
