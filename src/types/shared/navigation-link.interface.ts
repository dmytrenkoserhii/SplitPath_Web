export interface NavigationLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badgeContent?: string | number;
  isActive?: boolean;
}
