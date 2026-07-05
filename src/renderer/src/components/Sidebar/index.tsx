import logo32x32 from '@assets/logo-32x32.svg';
import {
  DashboardIcon,
  HelpIcon,
  LogoutIcon,
  OrderIcon,
  ProductIcon,
  SaleIcon,
  SettingIcon,
  SidebarToggleIcon,
} from '@components/Icons';
import { useThemeMode } from '@hooks/useThemeMode';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';

interface NavItem {
  key: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  {
    key: 'dashboard',
    icon: DashboardIcon,
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
  },
  {
    key: 'products',
    icon: ProductIcon,
    label: 'Produtos',
    to: ROUTES.PRODUCTS,
  },
  { key: 'orders', icon: OrderIcon, label: 'Pedidos', to: ROUTES.ORDERS },
  { key: 'sales', icon: SaleIcon, label: 'Vendas', to: ROUTES.SALES },
  {
    key: 'settings',
    icon: SettingIcon,
    label: 'Configurações',
    to: ROUTES.SETTINGS,
  },
];

const bottomNavItems: NavItem[] = [
  { key: 'help', icon: HelpIcon, label: 'Ajuda', to: ROUTES.HELP },
  { key: 'logout', icon: LogoutIcon, label: 'Sair', to: ROUTES.LOGOUT },
];

const EXPANDED_WIDTH = 272;
const COLLAPSED_WIDTH = 88;
const SIDEBAR_STORAGE_KEY = 'meu-negocio-sidebar-expanded';

function readStoredExpanded(): boolean {
  const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

function SidebarNavItem({
  item,
  isExpanded,
}: {
  item: NavItem;
  isExpanded: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname === item.to;
  const Icon = item.icon;

  return (
    <ListItemButton
      component={NavLink}
      to={item.to}
      selected={isActive}
      sx={{
        borderRadius: 2,
        mx: 1,
        color: isActive ? 'primary.main' : 'text.primary',
        justifyContent: isExpanded ? 'flex-start' : 'center',
        '&.Mui-selected': {
          bgcolor: 'action.selected',
          '&:hover': { bgcolor: 'action.selected' },
        },
      }}
    >
      <ListItemIcon
        sx={{ minWidth: 0, mr: isExpanded ? 2 : 0, color: 'inherit' }}
      >
        <Icon />
      </ListItemIcon>
      {isExpanded && <ListItemText primary={item.label} />}
    </ListItemButton>
  );
}

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(readStoredExpanded);
  const { mode, toggleMode } = useThemeMode();

  function toggleExpanded() {
    setIsExpanded((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  }

  const width = isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create('width'),
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: (theme) => theme.transitions.create('width'),
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: 2, py: 2 }}
      >
        <Box
          component="img"
          src={logo32x32}
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          sx={{ borderRadius: '3px', flexShrink: 0 }}
        />
        {isExpanded && (
          <Box sx={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              Meu Negócio
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              component="div"
            >
              Free plan
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={toggleExpanded}
          size="small"
          aria-label={isExpanded ? 'Recolher sidebar' : 'Expandir sidebar'}
          sx={{
            transform: isExpanded ? undefined : 'scaleX(-1)',
            flexShrink: 0,
          }}
        >
          <SidebarToggleIcon size={20} />
        </IconButton>
      </Stack>

      <List sx={{ flex: 1 }} aria-label="Sidebar navigation">
        {navItems.map((item) => (
          <SidebarNavItem key={item.key} item={item} isExpanded={isExpanded} />
        ))}
      </List>

      <List aria-label="Sidebar support">
        <ListItemButton
          onClick={toggleMode}
          aria-label={
            mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
          }
          sx={{
            borderRadius: 2,
            mx: 1,
            justifyContent: isExpanded ? 'flex-start' : 'center',
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 2 : 0 }}>
            {mode === 'dark' ? (
              <Brightness7 fontSize="small" />
            ) : (
              <Brightness4 fontSize="small" />
            )}
          </ListItemIcon>
          {isExpanded && (
            <ListItemText
              primary={mode === 'dark' ? 'Tema claro' : 'Tema escuro'}
            />
          )}
        </ListItemButton>
        {bottomNavItems.map((item) => (
          <SidebarNavItem key={item.key} item={item} isExpanded={isExpanded} />
        ))}
      </List>
    </Drawer>
  );
}
