# Desenvolvimento

## 1. Publicação de nova versão do APP

Ao enviar uma nova tag ao remoto, o GitHub cria automaticamente a release com os artefatos executáveis do projeto.

| Arquivo                          | Descrição                         |
| -------------------------------- | --------------------------------- |
| `Meu Negócio Setup <versão>.exe` | Instalador NSIS para Windows      |
| `latest.yml`                     | Metadados do `electron-updater`   |
| `*.blockmap`                     | Mapa de blocos para delta updates |

Para publicar:

```bash
git push origin main
git push origin --tags
```
