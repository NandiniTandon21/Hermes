'use client'
import React from 'react';
import { Sun, Monitor, Moon } from 'lucide-react';

type Theme = 'light' | 'system' | 'dark';

interface ThemeSwitcherProps {
    currentTheme?: Theme;
    onThemeChange?: (theme: Theme) => void;
    className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
    currentTheme = 'dark',
    className = ''
}) => {
    const [selectedTheme, setSelectedTheme] = React.useState<Theme>(currentTheme);

    React.useEffect(() => {
        // On mount, check localStorage or system preference
        const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme : null;
        if (storedTheme) {
            setSelectedTheme(storedTheme);
            applyTheme(storedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setSelectedTheme('dark');
            applyTheme('dark');
        }
    }, []);

    const applyTheme = (theme: Theme) => {
        if (typeof window === 'undefined') return;
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(systemTheme);
            localStorage.removeItem('theme');
        } else {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
    };

    const handleThemeChange = (theme: Theme) => {
        setSelectedTheme(theme);
        applyTheme(theme);
    };

    const themes = [
        {
            key: 'light' as Theme,
            icon: Sun,
            label: 'Switch to light theme',
            ariaLabel: 'Switch to light theme'
        },
        {
            key: 'system' as Theme,
            icon: Monitor,
            label: 'Switch to system theme',
            ariaLabel: 'Switch to system theme'
        },
        {
            key: 'dark' as Theme,
            icon: Moon,
            label: 'Switch to dark theme',
            ariaLabel: 'Switch to dark theme'
        }
    ];

    return (
        <div className={`inline-flex ${className}`}>
            <div
                role="radiogroup"
                className="flex gap-2 rounded-lg p-1 bg-background dark:bg-background transition-colors duration-200 border border-gray-200 dark:border-gray-700"
            >
                {themes.map(({ key, icon: Icon, label, ariaLabel }) => {
                    const isSelected = selectedTheme === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            role="radio"
                            aria-label={ariaLabel}
                            title={label}
                            aria-checked={isSelected}
                            onClick={() => handleThemeChange(key)}
                            className={`
                p-2 rounded-md transition-all duration-200
                ${isSelected
                                ? 'bg-muted text-foreground dark:bg-muted dark:text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:text-foreground dark:hover:bg-muted'
                            }
                focus:outline-none
              `}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ThemeSwitcher;