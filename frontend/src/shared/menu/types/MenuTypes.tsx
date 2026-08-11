export interface MenuButton {
  label: string;
  route: string;
  icon?: string;
}

export interface MenuState {
  buttons: MenuButton[];
  isLoading: boolean;
}

export interface MenuActions {
  handleNavigate: (route: string) => void;
}