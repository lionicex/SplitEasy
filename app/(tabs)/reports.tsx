import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart as PieChartIcon, Calendar, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import CategoryIcon from '@/components/CategoryIcon';
import EmptyState from '@/components/EmptyState';

export default function ReportsScreen() {
  const { currentUser, expenses, getCategoryReport, settings } = useStore();
  const [timeFrame, setTimeFrame] = useState<'month' | 'year'>('month');
  
  if (!currentUser) return null;
  
  const categoryReport = getCategoryReport(currentUser.id);
  const hasExpenses = expenses.length > 0;
  
  const renderCategoryItem = (item, index) => {
    if (item.amount === 0) return null;
    
    return (
      <View key={index} style={styles.categoryItem}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIconContainer}>
            <CategoryIcon category={item.category} size={36} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
            <Text style={styles.categoryAmount}>${item.amount.toFixed(2)}</Text>
          </View>
          <Text style={styles.categoryPercentage}>
            {item.percentage.toFixed(1)}%
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${item.percentage}%` }
            ]} 
          />
        </View>
      </View>
    );
  };
  
  const renderEmptyState = () => (
    <EmptyState
      title="No expense data yet"
      description="Add expenses to see detailed reports and insights about your spending."
      icon={<PieChartIcon size={64} color={Colors.primary} />}
    />
  );
  
  const renderPremiumLock = () => (
    <View style={styles.premiumLockContainer}>
      <View style={styles.premiumLockContent}>
        <PieChartIcon size={64} color={Colors.primary} />
        <Text style={styles.premiumLockTitle}>
          Unlock Detailed Reports
        </Text>
        <Text style={styles.premiumLockDescription}>
          Upgrade to premium to access detailed spending reports, charts, and insights.
        </Text>
        <TouchableOpacity style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
          <ArrowRight size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Reports" />
      
      {!hasExpenses ? (
        renderEmptyState()
      ) : !settings.isPremium ? (
        renderPremiumLock()
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.timeFrameContainer}>
            <TouchableOpacity
              style={[
                styles.timeFrameButton,
                timeFrame === 'month' && styles.activeTimeFrame,
              ]}
              onPress={() => setTimeFrame('month')}
            >
              <Text
                style={[
                  styles.timeFrameText,
                  timeFrame === 'month' && styles.activeTimeFrameText,
                ]}
              >
                This Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeFrameButton,
                timeFrame === 'year' && styles.activeTimeFrame,
              ]}
              onPress={() => setTimeFrame('year')}
            >
              <Text
                style={[
                  styles.timeFrameText,
                  timeFrame === 'year' && styles.activeTimeFrameText,
                ]}
              >
                This Year
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>Spending by Category</Text>
            <View style={styles.categoriesList}>
              {categoryReport.map(renderCategoryItem)}
            </View>
          </View>
          
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>Monthly Trends</Text>
            <View style={styles.comingSoonContainer}>
              <Calendar size={32} color={Colors.primary} />
              <Text style={styles.comingSoonText}>
                Monthly trend charts coming soon
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  timeFrameContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTimeFrame: {
    backgroundColor: Colors.white,
  },
  timeFrameText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.subtext,
  },
  activeTimeFrameText: {
    color: Colors.text,
  },
  reportCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reportTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  categoriesList: {
    gap: 16,
  },
  categoryItem: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainer: {
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  categoryAmount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.subtext,
  },
  categoryPercentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  comingSoonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  comingSoonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.subtext,
    marginTop: 8,
  },
  premiumLockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  premiumLockContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumLockTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  premiumLockDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  premiumButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
    marginRight: 8,
  },
});