# OT-WSP — Contexto permanente

## Qué es este proyecto
Prueba de concepto para gestión de Órdenes de Trabajo (OT) con notificaciones WhatsApp.
Replica la arquitectura de Software-Arceo para luego aplicar el mismo patrón al producto real.

## Stack
- Backend: Express + TypeScript (estructura idéntica a Software-Arceo)
- Frontend: Vite + React + TypeScript + Tailwind (idéntico a Software-Arceo)
- DB: PostgreSQL via Prisma
- WhatsApp: llamada directa a Chatwoot API → Meta Cloud API (sin n8n)

## Regla de arquitectura más importante
Patrón obligatorio: route → controller → service → prisma
Nunca lógica de negocio en controllers ni en routes.

## Regla de negocio principal
- Tarea PÚBLICA → enviar WhatsApp a TODOS los del personal asignado a esa OT
- Tarea PRIVADA → enviar solo a los teléfonos en tarea.destinatarios[]
- Marcar tarea.enviada = true solo cuando Chatwoot confirma 200 en todos los envíos

## Integración WhatsApp
- Toda llamada HTTP a Chatwoot vive ÚNICAMENTE en chatwoot.service.ts
- Flujo por cada destinatario: buscar/crear contacto → buscar/crear conversación → enviar mensaje
- Primer mensaje a contacto nuevo: requiere template aprobado en Meta (template_params)
- Contacto que respondió en las últimas 24hs: puede recibir mensaje libre sin template

## Convenciones (igual que Software-Arceo)
- Zod para validación en validators/
- Singleton Prisma en lib/prisma.ts
- Interfaces TypeScript en interfaces/
- .env para todas las variables, nunca hardcodear
- TypeScript estricto en todo momento

## Teléfonos
Siempre formato internacional: +549XXXXXXXXXX

## Cómo usar los MCP instalados
- Cualquier duda sobre Prisma, Express, Tailwind, React Query → agregar "use context7" al prompt
- Para explorar Software-Arceo → usar MCP filesystem
- Para consultar la DB en desarrollo → usar MCP postgres
