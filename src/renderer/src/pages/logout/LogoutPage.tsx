import { ConfirmDialog } from '@components/ConfirmDialog';
import { LogoutIcon } from '@components/Icons';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';

export function LogoutPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ minHeight: '60vh', textAlign: 'center' }}
    >
      <Box sx={{ color: 'primary.main' }}>
        <LogoutIcon size={32} />
      </Box>
      <Typography variant="h5">Até logo!</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        O Meu Negócio é um aplicativo local — seus dados continuam salvos neste
        computador. Você pode voltar para o painel quando quiser.
      </Typography>
      <Stack direction="row" spacing={1.5}>
        <Button component={Link} to={ROUTES.DASHBOARD} variant="contained">
          Voltar ao Dashboard
        </Button>
        <Button color="error" onClick={() => setConfirmOpen(true)}>
          Fechar aplicativo
        </Button>
      </Stack>
      <ConfirmDialog
        open={confirmOpen}
        title="Fechar aplicativo"
        confirmLabel="Fechar"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => window.api.app.quit()}
      >
        Tem certeza que deseja fechar o Meu Negócio? Seus dados continuam salvos
        neste computador.
      </ConfirmDialog>
    </Stack>
  );
}
