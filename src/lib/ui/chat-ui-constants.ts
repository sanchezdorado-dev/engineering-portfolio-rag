export const CHAT_UI = {
    WINDOW: {
        WIDTH_PX: 370,
        MAX_HEIGHT_PX: 600,
    },

    BUTTON: {
        SIZE_PX: 56,
        OFFSET_BOTTOM_PX: 24,
        OFFSET_RIGHT_PX: 24,
    },

    MESSAGES: {
        MAX_VISIBLE: 50,
    },

    INPUT: {
        MAX_LENGTH: 500,
        MAX_TEXTAREA_HEIGHT_PX: 120,
    },

    Z_INDEX: 60,
} as const;

export type ChatUiConstants = typeof CHAT_UI;
