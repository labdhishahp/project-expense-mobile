export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_HORIZONTAL_MARGIN = 16;
export const TAB_BAR_BOTTOM_MARGIN = 14;
export const FAB_SIZE = 56;

export function getTabBarBottomInset(safeAreaBottom: number): number {
  return TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + Math.max(safeAreaBottom, 12);
}

export function getFabBottomOffset(safeAreaBottom: number): number {
  return getTabBarBottomInset(safeAreaBottom) + 12;
}
