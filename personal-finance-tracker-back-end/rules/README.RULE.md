# 🎯 Rule Engine - Personal Finance Tracker

A comprehensive rule-based system for analyzing financial data and providing personalized insights, warnings, and recommendations.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Rules](#available-rules)
- [API Endpoints](#api-endpoints)
- [Rule Types](#rule-types)
- [Usage Examples](#usage-examples)
- [Adding New Rules](#adding-new-rules)

## 🔍 Overview

The Rule Engine is an independent logic processing layer that analyzes user financial data and generates actionable insights. It runs automatically to:

- **Monitor budgets** and send early warnings
- **Analyze spending patterns** and detect anomalies
- **Calculate financial health scores**
- **Provide personalized recommendations**

## 📊 Available Rules

### 1. Budget Monitoring Rule

**Purpose:** Monitor budget usage and alert when thresholds are exceeded

**Alerts:**
- 🚨 **Red Alert** (100%+): Budget exceeded
- ⚠️ **Yellow Warning** (90%+): Near budget limit
- 💡 **Info** (70%+): High usage notification

**Example Output:**
```json
{
  "type": "danger",
  "category": "Food & Dining",
  "message": "🚨 Bạn đã vượt ngân sách Food & Dining! Đã chi 1,200,000đ / 1,000,000đ (120%)",
  "data": {
    "spent": 1200000,
    "limit": 1000000,
    "percentage": 120,
    "overspent": 200000
  },
  "action": "Xem chi tiết chi tiêu"
}
```

### 2. Income Monitoring Rule

**Purpose:** Track income patterns and warn about financial risks

**Rules:**
- 🚨 Spending exceeds income for 3 consecutive months
- 📉 Income decreased significantly (>30%)
- ⚠️ No income detected this month

**Example Output:**
```json
{
  "type": "danger",
  "message": "🚨 Chi tiêu vượt thu nhập 3 tháng liên tiếp! Tổng thiếu hụt: 5,000,000đ",
  "action": "Tạo ngân sách khẩn cấp"
}
```

### 3. Spending Behavior Analysis Rule

**Purpose:** Analyze spending patterns and provide insights

**Rules:**
- 📈 **Overspending Spike**: Category spending increased >30%
- 🎉 **Saving Opportunity**: Total spending decreased >20%
- 🔄 **Recurring Transactions**: Detect potential subscriptions

**Example Outputs:**

**Spike Detection:**
```json
{
  "type": "info",
  "category": "Food & Dining",
  "message": "🔔 Chi tiêu cho 'Food & Dining' tăng 45% so với tháng trước. Bạn có muốn điều chỉnh ngân sách?",
  "action": "Tạo/Điều chỉnh ngân sách"
}
```

**Saving Opportunity:**
```json
{
  "type": "success",
  "message": "🎉 Tuyệt vời! Bạn đã tiết kiệm được 800,000đ (25%) so với tháng trước!",
  "action": "Chuyển vào tiết kiệm"
}
```

### 4. Financial Health Score Rule

**Purpose:** Calculate overall financial health (0-100 score)

**Score Breakdown:**
- **30 points** - Expense/Income Ratio
- **25 points** - Budget Adherence
- **25 points** - Savings Rate
- **20 points** - Spending Consistency

**Scoring Criteria:**

| Score Range | Status | Message |
|-------------|--------|---------|
| 80-100 | Excellent | 🌟 Xuất sắc! Quản lý tài chính rất tốt |
| 60-79 | Good | ✅ Tốt! Đang phát triển tích cực |
| 40-59 | Average | ⚠️ Trung bình. Cần cải thiện |
| 0-39 | Poor | 🚨 Cần chú ý! Xem xét lại kế hoạch |

**Example Output:**
```json
{
  "type": "success",
  "message": "🌟 Xuất sắc! Điểm tài chính: 85/100. Bạn đang quản lý tài chính rất tốt!",
  "data": {
    "score": 85,
    "breakdown": {
      "expenseIncome": { "score": 28, "max": 30, "ratio": 65 },
      "budgetAdherence": { "score": 23, "max": 25, "overruns": 0 },
      "savings": { "score": 20, "max": 25, "rate": 15 },
      "consistency": { "score": 14, "max": 20, "variability": 25 }
    }
  }
}
```

## 🔌 API Endpoints

### Get All Insights
```http
GET /api/insights
Authorization: Bearer {token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Insights retrieved successfully",
  "data": {
    "insights": [...],
    "count": 8
  }
}
```

### Get Available Rules
```http
GET /api/insights/rules
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Rules retrieved successfully",
  "data": {
    "rules": [
      {
        "name": "Budget Monitoring",
        "description": "Monitors budget usage and alerts when thresholds are exceeded"
      },
      ...
    ]
  }
}
```

### Run Specific Rule
```http
GET /api/insights/rules/Budget%20Monitoring
Authorization: Bearer {token}
```

## 📈 Rule Types

### Alert Types

```typescript
enum RuleAlertType {
  DANGER = 'danger',    // Critical issues requiring immediate attention
  WARNING = 'warning',  // Important warnings
  INFO = 'info',        // Informational insights
  SUCCESS = 'success',  // Positive achievements
  META = 'meta'        // Metadata/scores
}
```

### Rule Result Structure

```typescript
interface RuleResult {
  type: RuleAlertType;
  category?: string;      // Optional category name
  message: string;        // User-friendly message
  data?: any;            // Additional data for frontend
  action?: string;       // Suggested action
}
```

## 💡 Usage Examples

### Frontend Integration

```javascript
// Fetch all insights
const response = await fetch('/api/insights', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data } = await response.json();

// Group by alert type
const grouped = {
  danger: data.insights.filter(i => i.type === 'danger'),
  warning: data.insights.filter(i => i.type === 'warning'),
  info: data.insights.filter(i => i.type === 'info'),
  success: data.insights.filter(i => i.type === 'success')
};

// Display to user
grouped.danger.forEach(alert => {
  showNotification(alert.message, 'error');
});
```

### Scheduled Execution

```typescript
// Run rules daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  const users = await getAllActiveUsers();
  
  for (const user of users) {
    const insights = await RuleEngine.runAll(user.id);
    
    // Send notifications
    if (insights.some(i => i.type === 'danger')) {
      await sendEmailNotification(user, insights);
    }
  }
});
```

## 🔧 Adding New Rules

### Step 1: Create Rule File

Create a new file in `rules/` directory:

```typescript
// rules/your-new.rule.ts
import { Rule, RuleResult, RuleAlertType } from "./types";

export const yourNewRule: Rule = {
  name: "Your Rule Name",
  description: "What this rule does",
  
  run: async (userId: string): Promise<RuleResult[]> => {
    const alerts: RuleResult[] = [];
    
    try {
      // Your logic here
      const data = await fetchData(userId);
      
      if (condition) {
        alerts.push({
          type: RuleAlertType.WARNING,
          message: "Your warning message",
          data: { /* relevant data */ },
          action: "Suggested action"
        });
      }
    } catch (error) {
      console.error("Rule error:", error);
    }
    
    return alerts;
  }
};
```

### Step 2: Register Rule

Add to `rules/engine.ts`:

```typescript
import { yourNewRule } from "./your-new.rule";

export class RuleEngine {
  private static readonly rules: Rule[] = [
    budgetRule,
    incomeRule,
    spendingRule,
    yourNewRule,  // Add here
    healthRule
  ];
}
```

### Step 3: Test

```bash
# Build
npm run build

# Start server
npm start

# Test endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/insights
```

## 🎨 Best Practices

1. **Keep rules independent** - Each rule should work standalone
2. **Use clear messages** - Write user-friendly Vietnamese messages
3. **Include actionable insights** - Always suggest what users can do
4. **Handle errors gracefully** - Don't let one rule failure break others
5. **Test with real data** - Verify rules with actual user scenarios
6. **Performance matters** - Optimize database queries
7. **Document your rules** - Add comments explaining the logic

## 📝 Rule Development Checklist

- [ ] Rule has clear purpose and description
- [ ] Error handling implemented
- [ ] Uses typed interfaces
- [ ] Returns structured RuleResult[]
- [ ] Messages are user-friendly (Vietnamese)
- [ ] Includes suggested actions
- [ ] Tested with sample data
- [ ] Documented in README
- [ ] Registered in engine.ts

## 🚀 Future Enhancements

- [ ] Machine learning for personalized thresholds
- [ ] Rule scheduling and cron jobs
- [ ] User preferences for rule sensitivity
- [ ] Historical insight tracking
- [ ] Email/Push notification integration
- [ ] A/B testing different rule parameters
- [ ] Rule performance analytics

## 📚 Related Documentation

- [API Documentation](../docs/API.md)
- [Repository Methods](../repositories/README.md)
- [Authentication](../docs/AUTH.md)

---

**Built with ❤️ for better financial management**
