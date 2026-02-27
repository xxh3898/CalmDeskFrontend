import { create } from 'zustand';
import { createAuthSlice } from './slices/createAuthSlice.js';
import { createAdminShopSlice } from './slices/createAdminShopSlice.js';
import { createEmployeeShop } from './slices/createEmployeeShop.js';
import { createUiSlice } from './slices/createUiSlice.js';
import { createAttendanceSlice } from './slices/createAttendanceSlice.js';
import { createChatSlice } from './slices/createChatSlice.js';
import { createNotificationSlice } from './slices/createNotificationSlice.js';

const useStore = create((set, get) => ({
    ...createAuthSlice(set, get),
    ...createAdminShopSlice(set, get),
    ...createEmployeeShop(set, get),
    ...createUiSlice(set, get),
    ...createAttendanceSlice(set, get),
    ...createChatSlice(set, get),
    ...createNotificationSlice(set, get), // 추가

}));

export default useStore;
