export default function getRandomColor({
    excludeLight = false,
    excludeDark = false,
    opacity,
} = {}) {
    const randomChannel = () => Math.floor(Math.random() * 256);

    let r, g, b;

    while (true) {
        r = randomChannel();
        g = randomChannel();
        b = randomChannel();

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (excludeLight && brightness > 200) continue;
        if (excludeDark && brightness < 50) continue;
        break;
    }

    if (opacity !== undefined && opacity >= 0 && opacity <= 1) {
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()}`;
}
