# ONE EARTH

**Tek dünya. Milyonlarca ses.**

ONE EARTH, insanların Dünya üzerinde yaklaşık bir konum seçip tek bir kelime bırakabildiği etkileşimli bir dijital sanat çalışmasıdır. Bırakılan her kelime, gezegenin üzerinde küçük bir ışığa dönüşür.

**Canlı:** https://berkantkull.github.io/oneearth/

## Özellikler

- Gerçek gündüz ve gece dokularına sahip etkileşimli 3B Dünya
- Gerçek Güneş yönüne göre gün/gece sınırı ve şehir ışıkları
- Hareketli bulut katmanı, okyanus yansımaları ve atmosfer ışığı
- Akıcı fare ve dokunmatik kontrolleri; görüntü netliğini koruyan kontrollü yakınlaştırma
- 81 il ve başlıca dünya şehirleri için Türkçe/İngilizce konum araması
- Arama sonucundan veya doğrudan Dünya üzerinden yaklaşık konum seçimi
- GPU üzerinde tek çağrıda çizilen, sıcak çekirdekli ve yumuşak haleli ışık işaretleri
- Türkçe ve İngilizce arayüz; dil tercihi tarayıcıda hatırlanır
- GPS izni istemeden, Dünya üzerinden yaklaşık konum seçimi
- 1–24 Unicode karakterden oluşan tek kelime doğrulaması
- Supabase için güvenli API katmanı, veritabanı migration dosyası ve Upstash oran sınırlaması
- Işık ayrıntıları, doğrudan yıldızı açan paylaşım bağlantıları ve 1080×1920 story görselleri
- Koordinat, doğrulama ve API sınırları için otomatik testler

## Gerçek veri ve GitHub Pages sürümü

Uygulama örnek veya uydurma kullanıcı aktivitesi göstermez. Veritabanı bağlı değilse sayaç **0 ışık** olarak başlar.

GitHub Pages kendi başına veritabanı çalıştırmaz. Bu proje, statik Pages arayüzünü Supabase Data API’ye bağlayarak ışıkları kalıcı tutabilir. Tarayıcı yalnızca düşük yetkili **publishable key** kullanır; okuma, doğrulama, ekleme ve temel hız sınırı veritabanındaki RLS/RPC kurallarıyla uygulanır.

Supabase bağlantı değerleri tanımlı değilse uygulama güvenli biçimde oturum moduna döner ve ışığın kalıcı olmadığını formda açıkça belirtir.

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
| `NEXT_PUBLIC_SUPABASE_URL` | GitHub Pages istemcisinin bağlanacağı Supabase proje adresi |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Tarayıcı için düşük yetkili Supabase publishable key |
| `SUPABASE_URL` | Sunucu tarafında kullanılan Supabase proje adresi |
| `SUPABASE_SERVICE_ROLE_KEY` | Yalnızca sunucuda tutulan Supabase servis anahtarı |
| `UPSTASH_REDIS_REST_URL` | Üretim oran sınırlaması için Upstash adresi |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST erişim anahtarı |
| `RATE_LIMIT_SALT` | Geçici istemci tanımlayıcılarını hashlemek için rastgele değer |
| `MODERATION_BLOCKLIST` | Virgülle ayrılmış temel kelime engel listesi |

Servis rolü anahtarı hiçbir zaman `NEXT_PUBLIC_` önekiyle tanımlanmamalıdır. Üretimde Upstash yapılandırılmamışsa yazma işlemleri güvenli biçimde kapalı kalır.

## Supabase kurulumu

1. Bir Supabase projesi oluşturun.
2. `supabase/migrations` klasöründeki iki migration dosyasını tarih sırasıyla çalıştırın.
3. GitHub reposunda `NEXT_PUBLIC_SUPABASE_URL` adlı Actions değişkenini oluşturun.
4. GitHub reposunda `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` adlı Actions secret’ını oluşturun.
5. Pages iş akışını yeniden çalıştırın. Sayaç ve ışıklar artık Supabase’den okunur; yeni ışıklar kalıcı kaydedilir.

Publishable key tarayıcıda kullanılmak üzere tasarlanmıştır ve yetkisi RLS ile sınırlıdır. `SUPABASE_SERVICE_ROLE_KEY` veya yeni `sb_secret_...` anahtarları hiçbir zaman GitHub Pages derlemesine eklenmemelidir.

## Mesajları görme ve moderasyon

Bırakılan kelimeler Supabase Dashboard içinde **Table Editor → `public` şeması → `lights` tablosu** yolunda görünür. Buradaki alanlar:

- `word`: kullanıcının bıraktığı kelime
- `latitude` / `longitude`: yaklaşık konum
- `created_at`: bırakılma zamanı
- `status`: `visible` ise yayında, `hidden` ise gizli

Uygunsuz bir ışığı kaldırmanın güvenli ve geri alınabilir yolu, ilgili satırdaki `status` değerini `hidden` yapıp kaydetmektir. Site ve genel API yalnızca `visible` kayıtları gösterir. Tekrar göstermek için değeri `visible` yapabilirsiniz.

Kalıcı silme gerekiyorsa satırı seçip Table Editor araç çubuğundaki **Delete row** işlemini kullanın. Yönetici silme yetkisi özellikle herkese açık GitHub Pages arayüzüne eklenmemiştir; Supabase servis anahtarını tarayıcıya koymak bütün veritabanını tehlikeye atar.

SQL Editor üzerinden aynı işlemler şu şekilde yapılabilir:

```sql
-- Önce yıldızı geri alınabilir biçimde gizleyin
update public.lights set status = 'hidden' where id = 'YILDIZ_UUID';

-- Yalnızca gerçekten kalıcı silmek isterseniz
delete from public.lights where id = 'YILDIZ_UUID';
```

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
