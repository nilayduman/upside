import { PlayerProfile, AdvancedMatchmaking } from './AdvancedMatchMaking';

interface PlayerSkills {
     roleplay: number;      // 1-10
     combat: number;        // 1-10
     strategy: number;      // 1-10
     teamwork: number;      // 1-10
     leadership: number;    // 1-10
   }
   
   interface PlayerBehavior {
     toxicityReports: number;
     commendations: number;
     averageSessionCompletion: number;  // percentage
     disconnectionRate: number;         // percentage
     responseTime: number;              // average seconds
     activeParticipation: number;       // 1-10
   }
   
   interface CampaignPreferences {
     style: ('combat' | 'roleplay' | 'exploration' | 'puzzle')[];
     tonePreference: ('serious' | 'casual' | 'humorous' | 'gritty')[];
     campaignLength: 'oneshot' | 'short' | 'medium' | 'long';
     maturityRating: 'family' | 'teen' | 'mature';
     fantasyLevel: 'low' | 'medium' | 'high';
     pvpPreference: boolean;
   }
   
   interface AdvancedPlayerProfile extends PlayerProfile {
     skills: PlayerSkills;
     behavior: PlayerBehavior;
     campaignPreferences: CampaignPreferences;
     equipment: {
       hasWebcam: boolean;
       hasMicrophone: boolean;
       internetSpeed: number;  // Mbps
       deviceType: 'mobile' | 'tablet' | 'desktop';
     };
     socialPreferences: {
       voiceChatPreferred: boolean;
       videoChatPreferred: boolean;
       textChatPreferred: boolean;
       languageFluency: Record<string, 'basic' | 'intermediate' | 'fluent' | 'native'>;
       ageGroup: '13-17' | '18-24' | '25-34' | '35+';
       groupSize: {
         min: number;
         max: number;
       };
     };
   }
   
   export class EnhancedMatchmaking extends AdvancedMatchmaking {
     private calculateEnhancedMatchQuality(
       player1: AdvancedPlayerProfile,
       player2: AdvancedPlayerProfile
     ): number {
       let score = super.calculateMatchQuality(player1, player2);
       const weights = {
         skillCompatibility: 0.15,
         behaviorCompatibility: 0.15,
         campaignPreferences: 0.15,
         technicalCompatibility: 0.1,
         socialCompatibility: 0.15,
         base: 0.3
       };
   
       // Skill Compatibility
       const skillScore = this.calculateSkillCompatibility(
         player1.skills,
         player2.skills
       );
   
       // Behavior Compatibility
       const behaviorScore = this.calculateBehaviorCompatibility(
         player1.behavior,
         player2.behavior
       );
   
       // Campaign Preferences Compatibility
       const campaignScore = this.calculateCampaignCompatibility(
         player1.campaignPreferences,
         player2.campaignPreferences
       );
   
       // Technical Compatibility
       const technicalScore = this.calculateTechnicalCompatibility(
         player1.equipment,
         player2.equipment
       );
   
       // Social Compatibility
       const socialScore = this.calculateSocialCompatibility(
         player1.socialPreferences,
         player2.socialPreferences
       );
   
       return (
         score * weights.base +
         skillScore * weights.skillCompatibility +
         behaviorScore * weights.behaviorCompatibility +
         campaignScore * weights.campaignPreferences +
         technicalScore * weights.technicalCompatibility +
         socialScore * weights.socialCompatibility
       );
     }
   
     private calculateSkillCompatibility(skills1: PlayerSkills, skills2: PlayerSkills): number {
       const skillDiffs = Object.keys(skills1).map(key => 
         Math.abs(skills1[key as keyof PlayerSkills] - skills2[key as keyof PlayerSkills])
       );
   
       const avgDiff = skillDiffs.reduce((a, b) => a + b, 0) / skillDiffs.length;
       return 1 - (avgDiff / 5);
     }
   
     private calculateBehaviorCompatibility(
       behavior1: PlayerBehavior,
       behavior2: PlayerBehavior
     ): number {
       const toxicityScore = Math.min(
         1,
         1 - ((behavior1.toxicityReports + behavior2.toxicityReports) / 20)
       );
       
       const reliabilityScore = (
         (behavior1.averageSessionCompletion + behavior2.averageSessionCompletion) / 2 +
         (1 - (behavior1.disconnectionRate + behavior2.disconnectionRate) / 2)
       ) / 2;
   
       const participationScore = Math.min(
         behavior1.activeParticipation,
         behavior2.activeParticipation
       ) / 10;
   
       return (toxicityScore * 0.4 + reliabilityScore * 0.4 + participationScore * 0.2);
     }
   
     private calculateCampaignCompatibility(
       prefs1: CampaignPreferences,
       prefs2: CampaignPreferences
     ): number {
       let score = 0;
   
       // Style compatibility
       const commonStyles = prefs1.style.filter(style => 
         prefs2.style.includes(style)
       ).length;
       score += commonStyles / Math.max(prefs1.style.length, prefs2.style.length);
   
       // Tone compatibility
       const commonTones = prefs1.tonePreference.filter(tone => 
         prefs2.tonePreference.includes(tone)
       ).length;
       score += commonTones / Math.max(prefs1.tonePreference.length, prefs2.tonePreference.length);
   
       // Campaign length compatibility
       score += prefs1.campaignLength === prefs2.campaignLength ? 1 : 0;
   
       // Maturity rating compatibility
       score += prefs1.maturityRating === prefs2.maturityRating ? 1 : 0;
   
       // Fantasy level compatibility
       const fantasyLevelDiff = Math.abs(
         ['low', 'medium', 'high'].indexOf(prefs1.fantasyLevel) -
         ['low', 'medium', 'high'].indexOf(prefs2.fantasyLevel)
       );
       score += 1 - (fantasyLevelDiff / 2);
   
       // PvP preference compatibility
       score += prefs1.pvpPreference === prefs2.pvpPreference ? 1 : 0;
   
       return score / 6; // Normalize to 0-1
     }
   
     private calculateTechnicalCompatibility(
       equipment1: AdvancedPlayerProfile['equipment'],
       equipment2: AdvancedPlayerProfile['equipment']
     ): number {
       const minInternetSpeed = Math.min(equipment1.internetSpeed, equipment2.internetSpeed);
       const internetScore = Math.min(1, minInternetSpeed / 50); // 50 Mbps as baseline
   
       const deviceScore = equipment1.deviceType === equipment2.deviceType ? 1 : 0.5;
   
       const peripheralScore = (
         (equipment1.hasWebcam === equipment2.hasWebcam ? 1 : 0) +
         (equipment1.hasMicrophone === equipment2.hasMicrophone ? 1 : 0)
       ) / 2;
   
       return (internetScore * 0.4 + deviceScore * 0.3 + peripheralScore * 0.3);
     }
   
     private calculateSocialCompatibility(
       social1: AdvancedPlayerProfile['socialPreferences'],
       social2: AdvancedPlayerProfile['socialPreferences']
     ): number {
       let score = 0;
   
       // Communication preference compatibility
       const commScore = (
         (social1.voiceChatPreferred === social2.voiceChatPreferred ? 1 : 0) +
         (social1.videoChatPreferred === social2.videoChatPreferred ? 1 : 0) +
         (social1.textChatPreferred === social2.textChatPreferred ? 1 : 0)
       ) / 3;
   
       // Language fluency compatibility
       const commonLanguages = Object.keys(social1.languageFluency)
         .filter(lang => social2.languageFluency[lang])
         .map(lang => Math.min(
           this.fluencyLevel(social1.languageFluency[lang]),
           this.fluencyLevel(social2.languageFluency[lang])
         ));
       
       const languageScore = commonLanguages.length > 0 ?
         Math.max(...commonLanguages) / 3 : 0;
   
       // Age group compatibility
       const ageScore = social1.ageGroup === social2.ageGroup ? 1 :
         Math.abs(
           this.ageGroupIndex(social1.ageGroup) -
           this.ageGroupIndex(social2.ageGroup)
         ) === 1 ? 0.5 : 0;
   
       // Group size compatibility
       const sizeScore = (
         Math.min(social1.groupSize.max, social2.groupSize.max) -
         Math.max(social1.groupSize.min, social2.groupSize.min)
       ) > 0 ? 1 : 0;
   
       return (
         commScore * 0.3 +
         languageScore * 0.3 +
         ageScore * 0.2 +
         sizeScore * 0.2
       );
     }
   
     private fluencyLevel(level: 'basic' | 'intermediate' | 'fluent' | 'native'): number {
       const levels = { basic: 0, intermediate: 1, fluent: 2, native: 3 };
       return levels[level];
     }
   
     private ageGroupIndex(ageGroup: '13-17' | '18-24' | '25-34' | '35+'): number {
       const indices = { '13-17': 0, '18-24': 1, '25-34': 2, '35+': 3 };
       return indices[ageGroup];
     }
   }