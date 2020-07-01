<?php

namespace Drupal\smart_content_funnelenvy\Plugin\smart_content\Condition;

use Drupal\smart_content\Condition\ConditionTypeConfigurableBase;

/**
 * Provides a Funnelenvy condition plugin.
 *
 * @SmartCondition(
 *   id = "funnelenvy",
 *   label = @Translation("Funnelenvy"),
 *   group = "funnelenvy",
 *   deriver = "Drupal\smart_content_funnelenvy\Plugin\Derivative\FunnelenvyConditionDeriver"
 * )
 */
class FunnelenvyCondition extends ConditionTypeConfigurableBase {

  /**
   * {@inheritdoc}
   */
  public function getLibraries() {
    $libraries = array_unique(array_merge(parent::getLibraries(), ['smart_content_funnelenvy/condition.funnelenvy']));
    return $libraries;
  }

}
