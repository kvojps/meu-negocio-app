import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { CheckIcon, DeleteIcon, EditIcon, OptionsIcon, ViewIcon } from '@components/Icons';

interface ActionsMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onPayment?: () => void;
  onDelete?: () => void;
}

export function ActionsMenu({ onView, onEdit, onPayment, onDelete }: ActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  function close() {
    setAnchorEl(null);
  }

  function handle(action: () => void) {
    action();
    close();
  }

  return (
    <>
      <IconButton size="small" aria-label="Ações" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <OptionsIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        {onView && (
          <MenuItem onClick={() => handle(onView)}>
            <ListItemIcon>
              <ViewIcon size={16} />
            </ListItemIcon>
            <ListItemText>Ver</ListItemText>
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => handle(onEdit)}>
            <ListItemIcon>
              <EditIcon size={16} />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
        )}
        {onPayment && (
          <MenuItem onClick={() => handle(onPayment)}>
            <ListItemIcon>
              <CheckIcon size={16} />
            </ListItemIcon>
            <ListItemText>Registrar pagamento</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => handle(onDelete)} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <DeleteIcon size={16} />
            </ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
