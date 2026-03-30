export type Locale = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'pt'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English', ko: '한국어', ja: '日本語', zh: '中文',
  es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português',
}

const translations: Record<string, Record<Locale, string>> = {
  siteTitle: {
    en: 'Meme Archive', ko: '밈 아카이브', ja: 'ミームアーカイブ', zh: '梗百科',
    es: 'Archivo de Memes', fr: 'Archives Memes', de: 'Meme-Archiv', pt: 'Arquivo de Memes',
  },
  heroTitle: {
    en: 'Discover Viral Memes', ko: '바이럴 밈 모아보기', ja: 'バイラルミームを発見', zh: '发现病毒式传播的梗',
    es: 'Descubre Memes Virales', fr: 'Decouvrez les Memes Viraux', de: 'Entdecke Virale Memes', pt: 'Descubra Memes Virais',
  },
  heroDesc: {
    en: 'Browse the hottest meme videos from YouTube, sorted by views and date.',
    ko: '유튜브에서 가장 핫한 밈 영상들을 조회수, 최신순으로 모아봐요.',
    ja: 'YouTubeの人気ミーム動画を再生回数順・日付順で閲覧',
    zh: '按浏览量和日期排序，浏览YouTube上最热门的梗视频。',
    es: 'Explora los videos de memes mas populares de YouTube, ordenados por vistas y fecha.',
    fr: 'Parcourez les videos de memes les plus populaires de YouTube, triees par vues et date.',
    de: 'Durchsuche die beliebtesten Meme-Videos von YouTube, sortiert nach Aufrufen und Datum.',
    pt: 'Navegue pelos videos de memes mais populares do YouTube, ordenados por visualizacoes e data.',
  },
  trending: {
    en: 'Trending', ko: '인기', ja: 'トレンド', zh: '热门',
    es: 'Tendencia', fr: 'Tendance', de: 'Trending', pt: 'Em Alta',
  },
  allMemes: {
    en: 'All Memes', ko: '전체 밈', ja: '全てのミーム', zh: '所有梗',
    es: 'Todos los Memes', fr: 'Tous les Memes', de: 'Alle Memes', pt: 'Todos os Memes',
  },
  sortByViews: {
    en: 'Most Viewed', ko: '조회수순', ja: '再生回数順', zh: '最多观看',
    es: 'Mas Vistos', fr: 'Plus Vues', de: 'Meistgesehen', pt: 'Mais Vistos',
  },
  sortByDate: {
    en: 'Latest', ko: '최신순', ja: '最新順', zh: '最新',
    es: 'Mas Recientes', fr: 'Plus Recents', de: 'Neueste', pt: 'Mais Recentes',
  },
  sortByRelevance: {
    en: 'Relevance', ko: '관련순', ja: '関連順', zh: '相关度',
    es: 'Relevancia', fr: 'Pertinence', de: 'Relevanz', pt: 'Relevancia',
  },
  videos: {
    en: 'videos', ko: '개 영상', ja: '本の動画', zh: '个视频',
    es: 'videos', fr: 'videos', de: 'Videos', pt: 'videos',
  },
  watchAll: {
    en: 'Watch All', ko: '전체 보기', ja: '全て見る', zh: '全部观看',
    es: 'Ver Todo', fr: 'Tout Voir', de: 'Alle Ansehen', pt: 'Ver Tudo',
  },
  swipeHint: {
    en: 'Swipe up for next video', ko: '위로 스와이프하면 다음 영상', ja: '上にスワイプして次の動画',
    zh: '向上滑动查看下一个视频',
    es: 'Desliza hacia arriba para el siguiente video', fr: 'Glissez vers le haut pour la video suivante',
    de: 'Nach oben wischen fur nachstes Video', pt: 'Deslize para cima para o proximo video',
  },
  loading: {
    en: 'Loading...', ko: '로딩 중...', ja: '読み込み中...', zh: '加载中...',
    es: 'Cargando...', fr: 'Chargement...', de: 'Laden...', pt: 'Carregando...',
  },
  noVideos: {
    en: 'No videos found. Try again later.', ko: '영상을 찾을 수 없습니다. 나중에 다시 시도해주세요.',
    ja: '動画が見つかりません。後でもう一度お試しください。', zh: '未找到视频。请稍后再试。',
    es: 'No se encontraron videos. Intentalo mas tarde.', fr: 'Aucune video trouvee. Reessayez plus tard.',
    de: 'Keine Videos gefunden. Versuche es spater erneut.', pt: 'Nenhum video encontrado. Tente novamente mais tarde.',
  },
  backToHome: {
    en: 'Back to Home', ko: '홈으로', ja: 'ホームへ', zh: '返回首页',
    es: 'Volver al Inicio', fr: 'Retour a l\'Accueil', de: 'Zuruck zur Startseite', pt: 'Voltar ao Inicio',
  },
  explore: {
    en: 'Explore', ko: '둘러보기', ja: '探索', zh: '探索',
    es: 'Explorar', fr: 'Explorer', de: 'Erkunden', pt: 'Explorar',
  },
  search: {
    en: 'Search memes...', ko: '밈 검색...', ja: 'ミーム検索...', zh: '搜索梗...',
    es: 'Buscar memes...', fr: 'Rechercher des memes...', de: 'Memes suchen...', pt: 'Pesquisar memes...',
  },
  privacyPolicy: {
    en: 'Privacy Policy', ko: '개인정보처리방침', ja: 'プライバシーポリシー', zh: '隐私政策',
    es: 'Politica de Privacidad', fr: 'Politique de Confidentialite', de: 'Datenschutz', pt: 'Politica de Privacidade',
  },
  termsOfService: {
    en: 'Terms of Service', ko: '이용약관', ja: '利用規約', zh: '服务条款',
    es: 'Terminos de Servicio', fr: 'Conditions d\'Utilisation', de: 'Nutzungsbedingungen', pt: 'Termos de Servico',
  },
  viewCount: {
    en: 'views', ko: '회', ja: '回視聴', zh: '次观看',
    es: 'vistas', fr: 'vues', de: 'Aufrufe', pt: 'visualizacoes',
  },
  prev: {
    en: 'Previous', ko: '이전', ja: '前へ', zh: '上一个',
    es: 'Anterior', fr: 'Precedent', de: 'Vorherige', pt: 'Anterior',
  },
  next: {
    en: 'Next', ko: '다음', ja: '次へ', zh: '下一个',
    es: 'Siguiente', fr: 'Suivant', de: 'Nachste', pt: 'Proximo',
  },
  apiKeyMissing: {
    en: 'YouTube API key not configured. Please add YOUTUBE_API_KEY to environment variables.',
    ko: 'YouTube API 키가 설정되지 않았습니다. 환경변수에 YOUTUBE_API_KEY를 추가해주세요.',
    ja: 'YouTube APIキーが設定されていません。環境変数にYOUTUBE_API_KEYを追加してください。',
    zh: 'YouTube API密钥未配置。请在环境变量中添加YOUTUBE_API_KEY。',
    es: 'Clave de API de YouTube no configurada.', fr: 'Cle API YouTube non configuree.',
    de: 'YouTube API-Schlussel nicht konfiguriert.', pt: 'Chave da API do YouTube nao configurada.',
  },
}

export function t(locale: Locale, key: string): string {
  return translations[key]?.[locale] || translations[key]?.['en'] || key
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const lang = navigator.language?.toLowerCase() || ''
  if (lang.startsWith('ko')) return 'ko'
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('es')) return 'es'
  if (lang.startsWith('fr')) return 'fr'
  if (lang.startsWith('de')) return 'de'
  if (lang.startsWith('pt')) return 'pt'
  return 'en'
}

export function formatViewCount(count: number, locale: Locale): string {
  if (locale === 'ko') {
    if (count >= 100000000) return `${(count / 100000000).toFixed(1)}억`
    if (count >= 10000) return `${(count / 10000).toFixed(1)}만`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}천`
    return count.toString()
  }
  if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}
