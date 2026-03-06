# Offline Rocket.Chat deployment

This profile is for a local-only deployment with:

- local MongoDB only
- HTTP redirected to self-signed HTTPS
- client access limited to `192.168.1.0/24` and `192.168.2.0/24`
- Rocket.Chat cloud, usage reporting, update checks, push gateway, and public marketplace access disabled
- private app uploads still available

## 1. Prepare the environment file

Copy [`.env.example`](./.env.example) to `deploy/offline/.env` and set:

- `ROCKETCHAT_IMAGE` to the image you want to run
- `ROCKETCHAT_DOMAIN` to the internal DNS name clients will use
- `ALLOW_SUBNET_1` and `ALLOW_SUBNET_2` if your LAN ranges differ

If you build your own image from this repo, point `ROCKETCHAT_IMAGE` at that local tag. The compose bundle does not require a special image name.

## 2. Generate the self-signed certificate

Run:

```bash
docker compose --env-file deploy/offline/.env -f deploy/offline/docker-compose.yml run --rm certgen
```

This writes `${ROCKETCHAT_DOMAIN}.crt` and `${ROCKETCHAT_DOMAIN}.key` into `deploy/offline/certs/`.

## 3. Start the stack

Run:

```bash
docker compose --env-file deploy/offline/.env -f deploy/offline/docker-compose.yml up -d
```

Rocket.Chat listens only behind nginx. MongoDB is not published to the host.

## 4. Internal DNS

Make sure `${ROCKETCHAT_DOMAIN}` resolves to the Docker host from clients on your LAN.

## 5. SMTP later

When you are ready to enable email, set `MAIL_URL` in `deploy/offline/.env` to your internal SMTP endpoint and restart the `rocketchat` container.

## What this profile enforces

- `RC_CLOUD_DISABLED=true` disables Rocket.Chat cloud startup, cloud token refresh, supported-version refresh, and marketplace network behavior in this fork.
- `RC_DISABLE_STATISTICS_REPORTING=true` stops usage reports from being sent.
- `OVERWRITE_SETTING_*` disables registration, update checks, NPS, and push gateway usage.
- `extra_hosts` blackholes the known Rocket.Chat cloud hostnames as defense in depth.
- nginx only allows the two LAN CIDRs plus localhost.
