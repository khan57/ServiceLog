export const theme = {
    colors: {
        background: '#0F172A', // Deep Navy/Black (Slate 900)
        card: '#1E293B', // Dark Blue-Grey (Slate 800)
        textPrimary: '#F1F5F9', // Off-white (Slate 100)
        textSecondary: '#94A3B8', // Light Grey (Slate 400)
        primary: '#3B82F6', // Electric Blue (Blue 500)
        onPrimary: '#FFFFFF',
        accent: '#F97316', // Neon Orange (Orange 500)
        success: '#10B981', // Emerald Green (Emerald 500)
        danger: '#EF4444', // Red (Red 500)
        border: '#334155', // Slate 700
        inputBackground: '#334155', // Slate 700
        tabBar: '#1E293B', // Slate 800
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 24,
        xl: 32,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '700' as '700',
            color: '#F1F5F9',
            letterSpacing: -0.5,
        },
        h2: {
            fontSize: 24,
            fontWeight: '600' as '600',
            color: '#F1F5F9',
            letterSpacing: -0.3,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600' as '600',
            color: '#F1F5F9',
        },
        body: {
            fontSize: 16,
            color: '#94A3B8',
            lineHeight: 24,
        },
        caption: {
            fontSize: 13,
            color: '#64748B', // Slate 500
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as '600',
            color: '#FFFFFF',
            letterSpacing: 0.5,
        }
    },
    shadows: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 5,
        },
        glow: {
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 10,
        }
    }
};
