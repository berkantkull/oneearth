# ONE EARTH

**Tek dünya. Milyonlarca ses.**

ONE EARTH, insanların Dünya üzerinde yaklaşık bir konum seçip tek bir kelime bırakabildiği etkileşimli bir dijital sanat çalışmasıdır. Bırakılan her kelime, gezegenin üzerinde küçük bir ışığa dönüşür.

**Canlı:** https://berkantkull.github.io/oneearth/

## Özellikler

- Gerçek gündüz ve gece dokularına sahip etkileşimli 3B Dünya
- Gerçek Güneş yönüne göre gün/gece sınırı ve şehir ışıkları
- Hareketli bulut katmanı, okyanus yansımaları ve atmosfer ışığı
- Fare, dokunmatik hareketler ve `+ / −` kontrolleriyle daha yakına kadar inceleme
- Yakınlaştırma düzeyine göre kademeli beliren, Türkçe ve İngilizce şehir adları
- Seçilen yaklaşık konuma yakınsa şehir adını otomatik tanıma
- Türkçe ve İngilizce arayüz; dil tercihi tarayıcıda hatırlanır
- GPS izni istemeden, Dünya üzerinden yaklaşık konum seçimi
- 1–24 Unicode karakterden oluşan tek kelime doğrulaması
- Supabase için güvenli API katmanı, veritabanı migration dosyası ve Upstash oran sınırlaması
- Işık ayrıntıları, paylaşım bağlantıları, mobil görünüm ve WebGL yedeği
- Koordinat, doğrulama ve API sınırları için otomatik testler

## Gerçek veri ve GitHub Pages sürümü

Uygulama örnek veya uydurma kullanıcı aktivitesi göstermez. Veritabanı bağlı değilse sayaç **0 ışık** olarak başlar.

GitHub Pages yalnızca statik dosya barındırdığı için bu sürümde bırakılan yeni ışıklar geçerli tarayıcı oturumunda görünür, ancak kalıcı olarak kaydedilmez. Kalıcı ve herkese açık ışıklar için uygulamanın Supabase ve sunucu API’leriyle Vercel benzeri bir platformda çalıştırılması gerekir.

## Yerel geliştirme

Gereksinim: Node.js 22 veya üzeri.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Tarayıcıdan `http://localhost:3000` adresini açın.

## Ortam değişkenleri

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Paylaşım kartlarında kullanılacak ana site adresi |
| `SUPABASE_URL` | Sunucu tarafında kullanılan Supabase proje adresi |
| `SUPABASE_SERVICE_ROLE_KEY` | Yalnızca sunucuda tutulan Supabase servis anahtarı |
| `UPSTASH_REDIS_REST_URL` | Üretim oran sınırlaması için Upstash adresi |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST erişim anahtarı |
| `RATE_LIMIT_SALT` | Geçici istemci tanımlayıcılarını hashlemek için rastgele değer |
| `MODERATION_BLOCKLIST` | Virgülle ayrılmış temel kelime engel listesi |

Servis rolü anahtarı hiçbir zaman `NEXT_PUBLIC_` önekiyle tanımlanmamalıdır. Üretimde Upstash yapılandırılmamışsa yazma işlemleri güvenli biçimde kapalı kalır.

## Supabase kurulumu

1. Bir Supabase projesi oluşturun.
2. `supabase/migrations/20261120000000_create_lights.sql` dosyasını çalıştırın.
3. Proje adresi ve servis rolü anahtarını dağıtım ortamına ekleyin.
4. Tarayıcıdan doğrudan tablo yazma izni vermeyin; bütün yazma işlemleri API üzerinden geçer.

Bir ışığı yayından kaldırmak için Supabase tablosundaki `status` alanını `hidden` yapın. Genel API yalnızca `visible` kayıtları döndürür.

## Kontroller

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run build:pages
```

## GitHub Pages dağıtımı

`.github/workflows/deploy-pages.yml` iş akışı `main` dalına gönderilen her değişiklikte testleri çalıştırır, statik sürümü üretir ve GitHub Pages’a yayımlar.

## Doku kaynakları

Dünya dokuları [Solar System Scope](https://www.solarsystemscope.com/textures/) tarafından CC BY 4.0 ile sunulan NASA Blue Marble ve Black Marble türevleridir. Normal ve speküler haritalar three.js örnek dokularından uyarlanmıştır. Dokular, Berkant Kul’un [Earth Live](https://github.com/berkantkull/earth-live) projesindeki optimize edilmiş WebP sürümlerinden alınmıştır.

## Lisans

© 2026 Berkant Kul. Tüm hakları saklıdır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.
