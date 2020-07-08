export interface Author {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface CommentText {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface StoryTitle {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface StoryUrl {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface Title {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface Url {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface HighlightResult {
  author: Author;
  comment_text: CommentText;
  story_title: StoryTitle;
  story_url: StoryUrl;
  title: Title;
  url: Url;
}

export interface Hit {
  created_at: Date;
  title: string;
  url: string;
  author: string;
  points: number;
  story_text?: any;
  comment_text: string;
  num_comments?: any;
  story_id: number;
  story_title: string;
  story_url: string;
  parent_id: number;
  created_at_i: number;
  relevancy_score: number;
  _tags: string[];
  objectID: string;
  _highlightResult: HighlightResult;
}

export interface HackerNews {
  hits: Hit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  query: string;
  params: string;
  processingTimeMS: number;
}
