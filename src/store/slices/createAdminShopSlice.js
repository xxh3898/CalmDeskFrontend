
import apiClient from "../../api/axios.js";

let pending = {};
let timer = null;

export const createAdminShopSlice = (set, get) => ({
  items: [],
  purchaseHistory: [],

  // 1. 초기 데이터 로드: 백엔드에서 모든 아이템 가져오기
  fetchItems: async (companyId) => {
    const rawId = companyId || get().user?.companyId || 444;
    const targetId = parseInt(String(rawId).split(':')[0], 10);

    set({ isLoading: true });
    try {
      const res = await apiClient.get(`/admin/shop/items`, {
        params: { companyId: targetId }
      });

      // 💡 백엔드 isActive를 프론트 active로 매핑
      const mappedItems = (Array.isArray(res.data) ? res.data : []).map(item => ({
        ...item,
        active: item.active ?? item.isActive
      }));

      set({ items: mappedItems, isLoading: false });
    } catch (error) {
      console.error("❌ 데이터 로드 실패:", error);
      set({ items: [], isLoading: false });
    }
  },

  // 2. 개별 아이템 활성 상태 토글
  toggleItemStatus: async (id) => {
    const previousItems = get().items;

    // 로컬 상태 즉시 반영 (Optimistic Update)
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, active: !(item.active ?? item.isActive) } : item
      ),
    }));

    try {
      await apiClient.patch(
        `/admin/shop/items/${id}/toggle`,
        {}
      );
      // 성공 시 백엔드에서 WebSocket으로 전체 리스트를 보내줄 것이므로 추가 작업 불필요
    } catch (error) {
      console.error("상태 변경 실패:", error);
      set({ items: previousItems }); // 원복
      alert("상태를 변경하지 못했습니다.");
    }
  },

  // 3. 전체 아이템 활성화
  activateAll: async () => {
    const targetId = parseInt(String(get().user?.companyId || 444).split(':')[0], 10);
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) => ({ ...item, active: true })),
    }));

    try {
      await apiClient.post(
        `/admin/shop/items/activate-all`,
        {},
        {
          params: { companyId: targetId },
        });
    } catch (error) {
      set({ items: previousItems });
      alert("전체 활성화 실패!");
    }
  },

  // 4. 전체 아이템 비활성화
  deactivateAll: async () => {
    const rawId = get().user?.companyId || 444;
    const targetId = parseInt(String(rawId).split(':')[0], 10);
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) => ({ ...item, active: false })),
    }));

    try {
      await apiClient.post(
        `/admin/shop/items/deactivate-all`,
        {},
        {
          params: { companyId: targetId },
        });
    } catch (error) {
      set({ items: previousItems });
      alert("전체 비활성화 실패!");
    }
  },

  // 5. 아이템 재고 수량 업데이트
  updateItemQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));

    pending[id] = quantity;

    clearTimeout(timer);
    timer = setTimeout(async () => {
      const entries = Object.entries(pending);
      pending = {};
      for (const [itemId, qty] of entries) {
        try {
          await apiClient.put(
            `/admin/shop/items/${itemId}/${qty}`,
            {}
          );
        } catch (error) {
          console.error(`${itemId} 업데이트 실패`, error);
        }
      }
    }, 500);
  },

  // 6. 실시간 상점 아이템 업데이트 (WebSocket/SSE용)
  setItems: (items) => {
    // 💡 백엔드의 필드명(active 또는 isActive)을 프론트의 active로 안전하게 매핑
    const mappedItems = (Array.isArray(items) ? items : []).map(item => ({
      ...item,
      active: item.active ?? item.isActive
    }));
    set({ items: mappedItems });
  },
});
