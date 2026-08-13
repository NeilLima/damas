export interface MenuButton {
  label: string;
  route: string;
  icon?: string;
  disabled?: boolean;
  note?: string;
}

export interface MenuState {
  buttons: MenuButton[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface MenuActions {
  handleNavigate: (route: string) => void;
  handleLogout: () => void;
}