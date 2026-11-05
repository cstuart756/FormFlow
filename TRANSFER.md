# FormFlow — Transfer Guide

Thank you for your interest in FormFlow. This guide explains everything needed to take over the product.

## 1. What You Are Buying
- Full source code (Node.js + Express + EJS)
- Live deployed app on Heroku (EU region)
- GitHub repository with full commit history
- Heroku app name: `formflow-cstuart`
- No third-party API keys or paid subscriptions beyond Heroku

## 2. Monthly Operating Costs
| Service | Cost |
|---------|------|
| Heroku Eco dyno | $5/month |
| GitHub | $0 (free) |
| **Total** | **$5/month** |

## 3. How to Deploy from Scratch
1. Clone the repo: `git clone https://github.com/cstuart756/formflow.git`
2. `cd formflow && npm install`
3. `heroku create your-app-name --region eu`
4. `git push heroku main`
5. `heroku ps:scale web=1`

## 4. Architecture
- **Backend:** Node.js + Express
- **Views:** EJS templates
- **Storage:** JSON files in `data/` (ephemeral on Heroku — see §5)
- **Frontend:** Vanilla JS + CSS (no build step)

## 5. Known Limitations & Improvement Path
1. **Data persistence:** Heroku's filesystem is ephemeral. The obvious upgrade is Heroku Postgres (`heroku addons:create heroku-postgresql:mini`) or a free tier of Supabase/Neon.
2. **No auth on builder:** Anyone visiting `/` can create a form. Add user accounts (e.g., Auth0, Clerk) for a real SaaS.
3. **No email notifications** on new responses. Add SendGrid/Resend integration.

## 6. What's Included in the Transfer
- GitHub repo ownership transfer
- Heroku app ownership transfer
- All source code and documentation

## 7. What Is NOT Included
- No existing users or revenue (this is a pre-revenue asset)
- No trademark
- No custom domain (buyer can add one)

## 8. Transfer Checklist
- [ ] Payment received via escrow
- [ ] GitHub repo transferred to buyer
- [ ] Heroku app transferred to buyer
- [ ] Buyer confirms app runs on their Heroku account
- [ ] Escrow releases funds