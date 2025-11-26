FROM node:20-slim AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN npm run build

FROM base AS runner
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ARG PORT=3000
ENV PORT=$PORT
EXPOSE $PORT

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

