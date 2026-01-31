export const theme = {
    colors: {
        background: '#F2F4F8',
        card: '#FFFFFF',
        textPrimary: '#1A1A1A',
        textSecondary: '#666666',
        primary: '#2C3E50', // Dark Slate
        onPrimary: '#FFFFFF',
        accent: '#E67E22', // Muted Orange for highlights
        success: '#27AE60',
        danger: '#C0392B',
        border: '#E0E0E0',
        inputBackground: '#F9F9F9',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 4,
        m: 8,
        l: 16,
    },
    typography: {
        h1: {
            fontSize: 28,
            fontWeight: '700' as '700',
            color: '#1A1A1A',
        },
        h2: {
            fontSize: 22,
            fontWeight: '600' as '600',
            color: '#1A1A1A',
        },
        body: {
            fontSize: 16,
            color: '#1A1A1A',
        },
        caption: {
            fontSize: 14,
            color: '#666666',
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as '600',
            color: '#FFFFFF',
        }
    },
    shadows: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        }
    }
};
