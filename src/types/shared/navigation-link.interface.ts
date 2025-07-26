export interface NavigationLink {
  label: string;
  href?: string;
  icon: React.ReactNode;
  description?: string;
  sublinks?: NavigationLink[];
  isActive?: boolean;
  badgeContent?: string | number;
}
