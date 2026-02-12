import { create } from 'zustand';
import { createAuthSlice } from './slices/createAuthSlice';
import { createAdminShopSlice } from './slices/createAdminShopSlice';
import { createEmployeeShop } from './slices/createEmployeeShop';
import { createUiSlice } from './slices/createUiSlice';
import { createAttendanceSlice } from './slices/createAttendanceSlice';
import { createChatSlice } from './slices/createChatSlice';

const useStore = create((set, get) => ({
    ...createAuthSlice(set, get),
    ...createAdminShopSlice(set, get),
    ...createEmployeeShop(set, get),
    ...createUiSlice(set, get),
    ...createAttendanceSlice(set, get),
    ...createChatSlice(set, get),

}));

export default useStore;
